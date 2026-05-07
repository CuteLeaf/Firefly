---
title: redis bitmap与雪花ID
published: 2026-05-04
description: 面试题一堆抢着说点赞功能要用redis bitmap，但是实现起来却失败了，为什么？
tags: [redis, bitmap, 雪花ID, 分布式, 技术]
category: 项目
draft: false
---

# Redis Bitmap 遇上雪花 ID 与分布式：一场注定失败的组合

> Bitmap 是 Redis 中极其精巧的数据结构——用 1 个 bit 标记一个用户状态，1 亿用户仅需 12 MB。但当它遇上雪花 ID（64 bit）和分布式架构时，一切美好都化为泡影。本文从三个维度（Bitmap 本身、雪花 ID、分布式）深度剖析这个经典踩坑，并给出最终方案。

---

## 〇、案发现场

用户首次点击"收藏"按钮，接口响应 **1.5 秒**，再次点击只需 **20ms**。Redis 中多出了一个占用 **256 KB** 的 Key。

```
# 第一次收藏（Key 不存在）
SETBIT collect:bit:1:2051776854918803458 1823456789 1
→ 耗时: 1500ms   ← 😰 用户肉眼可见的卡顿
→ Redis 内存增长: 256 KB（分配 offset 0~18 亿的 bit 空间并清零）

# 第二次收藏（Key 已存在）
SETBIT collect:bit:1:2051776854918803458 3456789012 1
→ 耗时: 20ms     ← ✅ 正常速度

# 第三次收藏
SETBIT collect:bit:1:2051776854918803458 987654321 1
→ 耗时: 18ms     ← ✅ 正常速度
```

**关键线索**：

| 指标 | 首次操作 | 后续操作 | 差异倍数 |
|:---|:---|:---|:---|
| 响应时间 | **1500 ms** | 20 ms | **75 倍** |
| Redis 内存变化 | +256 KB | 无变化 | - |
| Key 状态 | 不存在 → 创建 | 已存在 → 修改 | - |

为什么第一次这么慢？为什么后续又正常了？256 KB 从何而来？下面逐步拆解。

---

## 一、问题现象

使用 Redis Bitmap 存储用户交互状态（点赞/收藏/关注）时，**首次写入某个 Key 极慢**（数秒甚至超时），后续操作正常。

典型代码：

```java
// 收藏操作：SETBIT 设置用户位
Boolean wasCollected = redisTemplate.opsForValue().setBit(
    "collect:bit:1:" + targetId,
    toOffset(userId),   // offset 可达 42.9 亿
    true
);
```

其中 offset 转换逻辑：

```java
public static long toOffset(Long userId) {
    long hash = hash64(userId);
    return Math.abs(hash) % (2^32 - 1);  // 哈希取模，范围 0 ~ 42.9 亿
}
```

---

## 二、从 Bitmap 本身分析

### 2.1 SETBIT 的时间复杂度陷阱

Redis 官方文档对 SETBIT 的复杂度定义：

| 场景 | 时间复杂度 | 说明 |
|:---|:---|:---|
| Key 已存在，offset 在已有范围内 | **O(1)** | 直接修改对应 bit |
| **Key 不存在（首次写入）** | **O(offset)** | 从字节 0 到目标 offset **分配并零初始化整段内存** |

这是问题的直接原因：Redis Bitmap 底层是一个原始 bit 数组，首次 SETBIT 时必须把 0 到 offset 之间的所有字节都分配出来并清零。

### 2.2 内存分配量化

offset 经哈希取模后均匀分布在 0 ~ 42.9 亿之间，期望值约 21.4 亿。

| offset 大小 | 首次 SETBIT 分配内存 | 耗时量级 |
|:---|:---|:---|
| 100 万 | ~125 KB | 毫秒级 |
| 1 亿 | ~12 MB | 百毫秒级 |
| 10 亿 | ~120 MB | **秒级** |
| 21.4 亿（期望值） | ~256 MB | **数秒** |
| 42.9 亿（最坏） | ~512 MB | **超时风险** |

### 2.3 为什么后续操作快？

Key 一旦存在，内存已分配完毕，后续 SETBIT/GETBIT 都是 O(1)，所以第二次及之后操作正常。这也解释了为什么问题容易被忽视——开发/测试时第二次操作就正常了，只有"首次"才会暴露。

### 2.4 能否缩小 Offset 范围？

直觉方案：把取模上限从 `2^32` 缩小到 `2^20`（约 100 万），首次写入只需分配 128 KB。

**问题：哈希碰撞导致数据错误。**

不同 userId 可能映射到同一个 offset：

| 场景 | 碰撞后果 |
|:---|:---|
| 用户 A 和 B 映射到同一 offset | A 收藏后，查询 B 的收藏状态返回 true（误判） |
| B 取消收藏 | 把 A 的收藏状态也清掉了 |

碰撞概率（生日悖论公式）：

| Offset 上限 M | 单内容 100 人操作 | 单内容 1000 人操作 | 单内容 1 万人操作 | 首次分配内存 |
|:---|:---|:---|:---|:---|
| 2^32 (42.9 亿) | ≈ 0.0001% | ≈ 0.01% | ≈ 1.2% | 512 MB |
| 2^28 (2.68 亿) | ≈ 0.002% | ≈ 0.19% | ≈ 17% | 32 MB |
| 2^24 (1677 万) | ≈ 0.03% | ≈ 3% | ≈ 95% | 2 MB |
| 2^20 (104 万) | ≈ 0.48% | ≈ 100% | ≈ 100% | 128 KB |

**结论：缩小 Offset 到不卡的范围，碰撞率对热门内容不可接受。性能和正确性无法兼得。**

---

## 三、从雪花 ID 角度分析

### 3.1 雪花 ID 的结构决定了它不适合做 Bitmap offset

雪花 ID（64 bit）的结构：

```
┌──────────────────────────────────────────────────────────────────┐
│ 1 bit  │       41 bit        │  10 bit  │       12 bit          │
│ 符号位  │     时间戳(ms)       │  机器ID   │      序列号           │
│  0     │  1746000000000+...  │  0~1023  │      0~4095           │
└──────────────────────────────────────────────────────────────────┘
```

一个典型的雪花 ID：`2051776854918803458`（约 2 × 10^18）

**核心矛盾**：Bitmap offset 的有效范围是 `0 ~ 2^32 - 1`（约 42.9 亿），而雪花 ID 的值域是 `0 ~ 2^63 - 1`（约 9.2 × 10^18），**差了 20 亿倍**。

### 3.2 哈希取模是"治标不治本"的妥协

```
userId → hash64() 散列 → % (2^32 - 1) → offset
```

这带来了两个问题：

**问题 1：取模后的值仍然很大**

`hash64()` 输出均匀分布在 `Long.MIN_VALUE ~ Long.MAX_VALUE`，取模后均匀分布在 `0 ~ 2^32-1`。期望值约 21.4 亿，首次写入仍需分配 ~256 MB。

**问题 2：取模引入碰撞**

取模是压缩映射，必然存在多对一关系。两个不同的 userId 可能映射到同一个 offset，导致数据错误。

### 3.3 雪花 ID 的"时间递增"特性也无法利用

有人可能想：雪花 ID 是递增的，早期用户的 ID 较小，offset 不会太大？

**不对**——因为 `hash64()` 打散了原始 ID 的递增特性：

```
userId=1         → hash64 → 0x7A3B2C1D4E5F6A7B → % 2^32 → 1,823,456,789
userId=2         → hash64 → 0x1234567890ABCDEF → % 2^32 → 3,456,789,012
userId=100       → hash64 → 0xFEDCBA0987654321 → % 2^32 → 987,654,321
```

即使 userId 很小，hash 后的 offset 仍然可能很大。**递增特性被哈希完全破坏了。**

### 3.4 如果不用哈希，直接用雪花 ID 做 offset 呢？

更糟——雪花 ID 本身就是 19 位数字（~2^61），远超 Bitmap offset 上限 2^32，直接用会报错：

```
ERR bit offset is not an integer or out of range
```

### 3.5 从 ID 生成策略角度的替代方案

如果一定要用 Bitmap，需要让 ID 变小：

| 方案 | 原理 | offset 上限 | 首次分配内存 | 问题 |
|:---|:---|:---|:---|:---|
| **自增整数 ID** | DB auto_increment | 等于用户总数 | 极小 | ❌ 分库分表不适用，暴露业务信息 |
| **映射表** | userId → localId 映射 | 等于用户总数 | 极小 | ⚠️ 额外维护映射关系，多一次查询 |
| **号段模式（Leaf）** | 美团 Leaf segment | 等于用户总数 | 极小 | ⚠️ 需要引入 Leaf 组件 |
| **压缩雪花 ID** | 只取低 32 bit | 2^32 ≈ 42.9 亿 | 最大 512 MB | ❌ 低 32 bit 碰撞率高，回到原点 |

**结论**：在雪花 ID 体系下，没有好的办法让 ID 变小到适合 Bitmap。**换数据结构比换 ID 方案成本更低。**

### 3.6 雪花 ID 角度的本质

```
雪花 ID 的本质：全局唯一、趋势递增、64 bit
Bitmap offset 的本质：紧凑整数、0~2^32、bit 位映射

两者设计目标根本不同：
  雪花 ID → 保证唯一性 → 值域必须大
  Bitmap offset → 紧凑映射 → 值域必须小

强行用哈希取模桥接，既丢失了唯一性（碰撞），又没解决紧凑性（offset 仍大）。
```

---

## 四、从分布式角度分析

### 4.1 Redis 单线程阻塞：一个慢操作拖垮整个节点

Redis 是单线程模型（命令串行执行），一个 `SETBIT key 2147483648 1` 需要分配 256 MB 并清零，**在此期间该 Redis 节点无法响应任何其他请求**。

```
时间线：
t0  客户端A: SETBIT collect:bit:1:xxx 2147483648 1  ← 开始分配 256MB
t1  客户端B: GET user:info:123                       ← 排队等待...
t2  客户端C: INCR like:count:1:456                   ← 排队等待...
t3  客户端D: SADD follow:user:789:1 999              ← 排队等待...
t4  SETBIT 完成（耗时 2~5 秒）                        ← 客户端 B/C/D 全部超时
t5  客户端 B/C/D 的命令才开始执行
```

**影响范围**：不仅是收藏操作本身慢，同一 Redis 节点上的**所有业务**（登录、查询、计数）都会被阻塞。

### 4.2 Redis Cluster 数据倾斜

Redis Cluster 按 Key 的 hash slot 分配到不同节点。Bitmap 方案下：

```
collect:bit:1:10086  → slot A → 节点 1
collect:bit:1:10087  → slot B → 节点 2
collect:bit:2:10086  → slot C → 节点 3
```

如果某篇爆款文章首次被大量用户收藏，所有 `SETBIT` 操作都打到**同一个 Key**，即**同一个节点**。该节点瞬间承受：

- 内存分配压力（单次 256 MB）
- CPU 压力（memset 清零）
- 网络压力（响应延迟导致连接堆积）

而其他节点完全空闲——**典型的数据倾斜**。

### 4.3 KEYS 命令的集群隐患

同步任务中通常使用 `KEYS collect:bit:*` 扫描所有 Bitmap Key：

```java
Collection<String> keys = redisTemplate.keys("collect:bit:*");
```

在 Redis Cluster 中：
- `KEYS` 命令只扫描当前节点，需要用 `SCAN` 逐节点遍历
- `KEYS` 是 O(N) 操作，会阻塞当前节点
- 大量 Bitmap Key 时，同步任务本身也可能成为性能瓶颈

### 4.4 Bitmap 大 Key 的运维风险

| 运维操作 | 影响 |
|:---|:---|
| `DEL collect:bit:1:xxx` | 释放 256 MB 内存，可能触发 Redis 内存碎片整理，短暂卡顿 |
| `RDB` 持久化 | 大 Key 导致 RDB 生成时间变长，fork() 耗时增加 |
| `AOF` 重写 | 大 Key 导致 AOF 重写时间变长 |
| 主从同步 | 全量同步时大 Key 传输耗时，从节点长时间处于"加载中"状态 |
| `maxmemory` | 单个 Key 占用数百 MB，可能触发淘汰策略误杀其他 Key |

### 4.5 分布式角度的结论

| 问题 | Bitmap 方案 | Set 方案 |
|:---|:---|:---|
| 单线程阻塞 | ❌ SETBIT 分配数百 MB 阻塞整个节点 | ✅ SADD O(1)，毫秒级 |
| 数据倾斜 | ❌ 爆款内容所有操作打同一个节点 | ✅ 用户维度 Key 天然分散到不同 slot |
| 大 Key 风险 | ❌ 单 Key 数百 MB | ✅ 单用户 Key 通常几 KB |
| 同步扫描 | ❌ KEYS 阻塞 + Cluster 不友好 | ✅ 可用 pending Hash 队列，无需扫描 |
| 运维友好度 | ❌ DEL/RDB/AOF 全受影响 | ✅ 小 Key 无特殊影响 |

---

## 五、RoaringBitmap 能解决吗？

### 5.1 原理

RoaringBitmap 是压缩位图，将 32 位整数空间分成 65536 个桶，每桶按数据稀疏程度选择容器：

| 容器类型 | 触发条件 | 内存占用 |
|:---|:---|:---|
| **Array Container** | 桶内元素 ≤ 4096 | 2 bytes × 元素数 |
| **Bitmap Container** | 桶内元素 > 4096 | 8 KB（固定） |
| **Run Container** | 连续值多 | 更压缩 |

设置 offset=20 亿时，只需在对应桶里加一个元素（Array Container，2 bytes），**不会分配 250 MB**。

### 5.2 三种使用方式对比

#### 方式 A：RedisBloom 模块（RB.* 命令）

```redis
RB.SETBIT key 2000000000 1    -- O(1)，不预分配
RB.GETBIT key 2000000000      -- O(1)
```

| 维度 | 评价 |
|:---|:---|
| 首次写入 | ✅ O(1)，无预分配 |
| 原子性 | ✅ Redis 单线程保证 |
| **致命问题** | ❌ 需要安装 RedisBloom 模块，云 Redis 不一定支持 |

#### 方式 B：客户端序列化（Read-Modify-Write）

```java
byte[] data = redisTemplate.opsForValue().get(key);
RoaringBitmap bitmap = data != null
    ? RoaringBitmap.deserialize(data) : new RoaringBitmap();
bitmap.add(userId);
redisTemplate.opsForValue().set(key, bitmap.serialize());
```

| 维度 | 评价 |
|:---|:---|
| 首次写入 | ✅ 无预分配 |
| **致命问题 1** | ❌ 非原子操作：并发 Read-Modify-Write 导致数据丢失 |
| **致命问题 2** | ❌ 必须加分布式锁，延迟 5~15ms |
| **致命问题 3** | ❌ 每次操作全量序列化/反序列化，数据量大时很慢 |

#### 方式 C：Lua 脚本

不可行——Redis 内置 Lua 不支持 RoaringBitmap 库。

### 5.3 RoaringBitmap 结论

| 方案 | 首次写入 | 原子性 | 内存效率 | 额外依赖 | 推荐度 |
|:---|:---|:---|:---|:---|:---|
| RedisBloom 模块 | ✅ | ✅ | ✅ | RedisBloom | ⭐⭐⭐⭐ 有条件推荐 |
| 客户端序列化 | ✅ | ❌ 需加锁 | ✅ | RoaringBitmap | ⭐⭐ 不推荐 |
| **Set（用户维度）** | ✅ | ✅ | ⚠️ 稍高 | 无 | ⭐⭐⭐⭐⭐ **最推荐** |

**除非能装 RedisBloom 模块，否则 RoaringBitmap 客户端方案会丢失原子性，得不偿失。**

---

## 六、正确方案：String + Set（用户维度）

### 6.1 Key 设计

```
# 1. 操作总数（内容维度）—— String
like:count:{targetType}:{targetId}    →  INCR / DECR

# 2. 用户操作集合（用户维度）—— Set
like:user:{userId}:{targetType}       →  SADD / SREM / SISMEMBER
```

### 6.2 为什么用用户维度而不是内容维度的 Set？

| 方案 | Key | 问题 |
|:---|:---|:---|
| `like:article:{targetId}` → Set\<userId\> | 内容维度 | 爆款文章百万点赞，单 Key 几百 MB |
| `like:user:{userId}:{targetType}` → Set\<targetId\> | 用户维度 | 单用户操作量可控，通常几百~几千 |

用户维度的 Set 天然上限合理，加 TTL（如 7 天）冷数据自动淘汰。

### 6.3 操作流程

```java
// 点赞
Boolean added = redisTemplate.opsForSet().isMember(
    "like:user:" + userId + ":1", String.valueOf(targetId));
if (Boolean.TRUE.equals(added)) {
    throw new BusinessException("已点赞");
}
redisTemplate.opsForSet().add("like:user:" + userId + ":1",
    String.valueOf(targetId));
redisTemplate.opsForValue().increment("like:count:1:" + targetId);
// 异步写 MySQL

// 取消点赞
redisTemplate.opsForSet().remove("like:user:" + userId + ":1",
    String.valueOf(targetId));
redisTemplate.opsForValue().decrement("like:count:1:" + targetId);
// 异步删 MySQL

// 判断是否已点赞
Boolean isLiked = redisTemplate.opsForSet().isMember(
    "like:user:" + userId + ":1", String.valueOf(targetId));
```

### 6.4 缓存冷启动（Redis 无数据时）

```java
Boolean isLiked = redisTemplate.opsForSet().isMember(key, String.valueOf(targetId));
if (isLiked == null) {
    // key 不存在，从 MySQL 回捞
    RLock lock = redisson.getLock("lock:like:load:" + userId);
    lock.lock();
    try {
        List<Long> likedIds = likeMapper.selectByUserId(userId, targetType);
        if (CollUtil.isNotEmpty(likedIds)) {
            redisTemplate.opsForSet().add(key,
                likedIds.stream().map(String::valueOf).toArray());
        }
        redisTemplate.expire(key, 7, TimeUnit.DAYS);
    } finally {
        lock.unlock();
    }
}
```

### 6.5 方案对比

| 维度 | Bitmap + Hash（旧方案） | String + Set（新方案） |
|:---|:---|:---|
| 首次写入性能 | ❌ O(offset)，最大 512 MB | ✅ O(1)，始终毫秒级 |
| 判断是否已操作 | GETBIT O(1) | SISMEMBER O(1) |
| 数据正确性 | ⚠️ 哈希碰撞风险 | ✅ 零碰撞（存储原始 ID） |
| 内存效率（1 亿用户） | ✅ ~12 MB | ⚠️ ~2 GB（但单用户维度可控） |
| 内存效率（1 万用户） | ✅ ~1.2 KB | ✅ ~80 KB（可接受） |
| 计数查询 | HGET O(1) | INCR/GET O(1) |
| 分布式友好度 | ❌ 大 Key 阻塞单节点 | ✅ 小 Key 天然分散 |
| 原子性 | ✅ SETBIT 返回旧值 | ✅ SADD/SREM 原子 |

### 6.6 前端注意事项：雪花 ID 精度丢失

雪花 ID 约 19 位数字，超过 JS `Number.MAX_SAFE_INTEGER`（2^53 ≈ 16 位），JSON 序列化会丢精度：

```javascript
// 前端接收后
1234567890123456789  →  1234567890123456800  // 末尾精度丢失
```

**解决方案**：Jackson 序列化时将 Long 转 String。

```java
// 方式一：字段级注解
@JsonSerialize(using = ToStringSerializer.class)
private Long targetId;

// 方式二：全局配置 ObjectMapper
@Bean
public ObjectMapper objectMapper() {
    ObjectMapper mapper = new ObjectMapper();
    SimpleModule module = new SimpleModule();
    module.addSerializer(Long.class, ToStringSerializer.instance);
    module.addSerializer(Long.TYPE, ToStringSerializer.instance);
    mapper.registerModule(module);
    return mapper;
}
```

---

## 七、总结

### 三维问题全景

```
┌─────────────────────────────────────────────────────────────────────┐
│                        问题全景图                                     │
├──────────────┬──────────────────────────────────────────────────────┤
│              │  首次写入 O(offset) 分配数百 MB 内存                    │
│  Bitmap 本身  │  缩小 Offset → 碰撞率不可接受                         │
│              │  性能与正确性无法兼得                                    │
├──────────────┼──────────────────────────────────────────────────────┤
│              │  64 bit vs 32 bit offset，差 20 亿倍                   │
│  雪花 ID     │  哈希取模：既丢唯一性（碰撞），又没解决紧凑性（offset 仍大） │
│              │  递增特性被哈希破坏，无法利用                              │
│              │  换 ID 方案成本远高于换数据结构                           │
├──────────────┼──────────────────────────────────────────────────────┤
│              │  单线程阻塞：一个慢操作拖垮整个节点                       │
│  分布式      │  数据倾斜：爆款内容所有操作打同一个节点                    │
│              │  大 Key 运维：DEL/RDB/AOF/主从同步全受影响               │
│              │  KEYS 扫描：Cluster 不友好 + O(N) 阻塞                 │
└──────────────┴──────────────────────────────────────────────────────┘
```

### 问题-方案对照表

| 问题 | 原因 | 方案 |
|:---|:---|:---|
| 首次写入卡顿 | 雪花 ID → 大 offset → SETBIT O(offset) 分配内存 | 改用 Set 结构 |
| 缩小 Offset 不可行 | 哈希碰撞导致数据错误 | Set 存原始 ID，零碰撞 |
| 爆款内容 Set 过大 | 内容维度 Set 百万成员 | 改用用户维度 Set |
| 单线程阻塞 | SETBIT 分配数百 MB 阻塞整个 Redis 节点 | SADD O(1) 不阻塞 |
| 数据倾斜 | 爆款内容所有操作打同一节点 | 用户维度 Key 天然分散 |
| 大 Key 运维风险 | DEL/RDB/AOF/主从同步全受影响 | 小 Key 无特殊影响 |
| RoaringBitmap 不可行 | 客户端序列化丢失原子性 | 除非有 RedisBloom 模块 |
| 雪花 ID 不兼容 Bitmap | 64 bit vs 32 bit offset，差 20 亿倍 | 承认不兼容，换数据结构 |
| 前端 ID 精度丢失 | 雪花 ID > JS MAX_SAFE_INTEGER | Long 序列化为 String |

### 最终选型

**String（计数）+ Set（用户维度，判断是否已操作）+ 异步写库。**

不用 Bitmap（雪花 ID 太大），不用内容维度 Set（爆款 Key 太大），不用 RoaringBitmap（原子性难保证）。

### 什么时候 Bitmap 仍然适用？

Bitmap 并非一无是处，以下场景仍然是最优选择：

| 场景 | 条件 | 示例 |
|:---|:---|:---|
| 用户在线状态 | userId 为自增小整数 | `SETBIT online 42 1` |
| 签到打卡 | 日期作为 offset（1~31） | `SETBIT sign:userId:202601 15 1` |
| 布隆过滤器 | 概率型数据结构，允许误判 | 去重、防缓存穿透 |
| 活跃用户统计 | 自增 ID + 按天 Bitmap | BITCOUNT + BITOP 统计 DAU |

**核心判断标准：offset 是否为紧凑小整数（万级以内）。如果是雪花 ID，直接放弃 Bitmap。**
