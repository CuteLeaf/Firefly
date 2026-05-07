---
title: Spring-Cloud
published: 2025-01-01
description: 梳理 Spring Cloud 微服务面试题，涵盖注册中心 Eureka 与 Nacos、负载均衡、熔断降级及网关组件。
tags: [框架,JAVA,Spring-Cloud, 技术]
category: 面试
draft: false
---


# 组件
- 原生
	Eureka：注册中心
	Ribbon：负载均衡
	Feign：远程调用
	Hystrix：服务熔断
	zuul/gateway：网关
- Alibaba
	nacos  注册中心
	dubbo /OpenFeign 远程调用 Feign集成了Ribbon
	sentenal 配置流量控制和熔断降级规则
	gateway 
	seata 分布式事务
# 注册中心
## nacos
![|655x337](./image/框架-Spring-Cloud.assets/框架-Spring-Cloud-20260105163847.png)

## Eureka
![|541x310](./image/框架-Spring-Cloud.assets/框架-Spring-Cloud-20260105164017.png)
## nacos和Eureka区别
Nacos与eureka的共同点（注册中心)
- 都支持服务注册和服务拉取
- 都支持服务提供者心跳方式做健康检测
Nacos与Eureka的区别（注册中心）
- NaCOs支持服务端主动检测提供者状态：临时实例采用心跳模式，非临时实例采用主动检测模式
- 临时实例心跳不正常会被剔除，非临时实例则不会被剔除
- Nacos支持服务列表变更的消息推送模式，服务列表更新更及时
- Nacos集群默认采用AP方式，当集群中存在非I临时实例时，采用CP模式；Eureka采用AP方式
Nacos还支持了配置中心，eureka则只有注册中心，也是选择使用nacos的一个重要原因

# 负载均衡
## Rebbon
- （轮询）RoundRobinRule：简单轮询服务列表来选择服务器
- （权重）WeightedResponseTimeRule：按照权重来选择服务器，响应时间越长，权重越小
- （随机）RandomRule：随机选择一个可用的服务器
- BestAvailableRule：忽略那些短路的服务器，并选择并发数较低的服务器
- RetryRule：重试机制的选择逻辑
- AvailabilityFilteringRule：可用性敏感策略，先过滤非健康的，再选择连接数较小的实例
- （分区）ZoneAvoidanceRule：以区域可用的服务器为基础进行服务器的选择。使用Zone对服务器进行分类，这个zone可以理解为一个机房、一个机架等。而后再对zone内的多个服务做轮询

## Nacos + LoadBalancer
依托于 Spring Cloud 的服务注册与发现组件，当服务启动时，会向注册中心注册自己的信息


# 服务雪崩
- 服务雪崩：一个服务失败，导致整条链路的服务都失败的情形
- 服务降级：服务自我保护的一种方式，或者保护下游服务的一种方式，用于确保服务不会受请求突增影响变得不可用，确保服务不会崩溃，一般在实际开发中与feign接口整合，编写降级逻辑
- 服务熔断：默认关闭，需要手动打开，如果检测到10秒内请求的失败率超过50%，就触发熔断机制。之后每隔5秒重新尝试请求微服务，如果微服务不能响应，继续走熔断机制。如果微服务可达，则关闭熔断机制，恢复正常请求

常用工具
- sentinel 
- hystrix
# 微服务监控
常用工具
- Springboot+admin
- prometheus + Grafana
- zipkin
- skywalking
作用
- 问题定位
- 性能分析
- 服务关系
- 服务警告

# 限流
- Tomcat：最大连接数
- Nginx：漏桶算法
- 网关：令牌漏桶算法
- 自定义拦截器
- sentinel


1. 先来介绍业务，什么情况下去做限流，需要说明QPS具体多少
	- 我们当时有一个活动，到了假期就会抢购优惠券，QPS最高可以达到2000，平时10-50之间，为了应对突发流量需要做限流
	- 常规限流，为了防止恶意攻击，保护系统正常运行，我们当时系统能够承受最大的QPS是多少（压测结果）
2. nginx限流
	- 控制速率（突发流量），使用的漏桶算法来实现过滤，让请求以固定的速率处理请求，可以应对突发流量
	- 控制并发数，限制单个ip的链接数和并发链接的总数
3. 网关限流
	- 在springcloudgateway中支持局部过滤器RequestRateLimiter来做限流，使用的是令牌桶算法
	- 可以根据ip或路径进行限流，可以设置每秒填充平均速率，和令牌桶总容量
4. sentinel
	- 设置QPS类型并且设置单机阈值
5. 限流算法
	- 令牌漏桶
	- 漏桶
	- 滑动窗口

# 分布式事务
## Seata
Seata事务管理中有三个重要的角色：
- TC(TransactionCoordinator)-事务协调者：维护全局和分支事务的状态，协调全局事务提交或回滚。
- TM（TransactionManager)-事务管理器：定义全局事务的范围、开始全局事务、提交或回滚全局事务。
- RM(ResourceManager）-资源管理器：管理分支事务处理的资源，与TC交谈以注册分支事务和报告分支事务的状态，并驱动分支事务提交或回滚。
![](./image/框架-Spring-Cloud.assets/框架-Spring-Cloud-20260106172317.png)


## 模式
### XA
数据强一致性
![](./image/框架-Spring-Cloud.assets/框架-Spring-Cloud-20260106172614.png)

### AT
多了一个undo-log的表进行回滚
![](./image/框架-Spring-Cloud.assets/框架-Spring-Cloud-20260106172830.png)

### TCC
相当于冻结，手动维护一个类似状态的字段，代码耦合度高
![](./image/框架-Spring-Cloud.assets/框架-Spring-Cloud-20260106173148.png)

### SAGA

## MQ
上游处理，通知下游，预定重传
上游通知，下游处理，
![](./image/框架-Spring-Cloud.assets/框架-Spring-Cloud-20260106174112.png)




# 前后端幂等处理
如果前端不干防止接口抖动的话
客户端（按钮防重抖）+ 网关（拦截重复参数）+ 服务（幂等校验）+ 数据库（唯一约束）
![|655x335](./image/框架-Spring-Cloud.assets/框架-Spring-Cloud-20260106180425.png)

## token+redis
相当于预备操作
使用token+redis来实现，性能较好
- 第一次请求，生成一个唯一token存入redis，返回给前端
- 第二次请求，业务处理，携带之前的token，到redis进行验证，如果存在，可以执行业务，删除token；如果不存在，则直接返回，不处理业务
![|541x409](./image/框架-Spring-Cloud.assets/框架-Spring-Cloud-20260106180437.png)

# 分布式任务调度

## 路由策略

- FIRST（第一个）
	固定选择第一个机器
- LAST（最后一个）
	固定选择最后一个机器
- ROUND（轮询）
	任务在可用节点间轮流分发
- CONSISTENT_HASH
	基于参数的一致性HASH，分发到同一个执行器节点上，确保相同参数的任务总是在相同节点上执行
- LEAST_FREQUENTLY_USED（最不经常使用）
	使用频率最低的机器优先被选举
- LEAST_RECENTLY_USED（最近最久未使用）
	最久未使用的机器优先被选举
- FAILOVER（故障转移）
	按照顺序依次进行心跳检测，第一个心跳检测成功的机器选定为目标执行器并发起调度
- BUSYOVER（忙碌转移）
	按照顺序依次进行空闲检测，第一个空闲检测成功的机器选定为目标执行器并发起调度
- SHARDING_BROADCAST（分片广播）
	广播触发对应集群中所有机器执行一次任务，同时系统自动传递分片参数；可根据分片参数开发分片任务

## xxl-job路由策略有哪些?
xxl-job提供了很多的路由策略，我们平时用的较多就是：轮询、故障转移、分片广播..
## xxl-job任务执行失败怎么解决？
1. 路由策略选择故障转移，使用健康的实例来执行任务
2. 设置重试次数
3. 查看日志+邮件告警来通知相关负责人解决
## 如果有大数据量的任务同时都需要执行，怎么解决？
1. 让多个实例一块去执行（部署集群），路由策略分片广播
2. 在任务执行的代码中可以获取分片总数和当前分片，按照取模的方式分摊到各个实例执行
