---
title: JSON
published: 2025-01-01
description: 深入讲解 FastJSON 与 Jackson 两大 JSON 处理库的使用方法，包括基本类操作、JSONPath、注解配置及多层 JSON 解析实战示例。
tags: [JSON, 技术]
category: JAVA
draft: false
---


# FastJson

## 依赖

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>x.x.x</version>
</dependency>
```

---

## 1. JSON 类

静态方法，提供核心的序列化与反序列化功能。

### 1.1 parseObject

- **作用**：将 JSON 字符串解析为 Java 对象。
- **参数**：
  - `String text`：JSON 格式的字符串。
  - `Class<T> clazz`：目标对象的 Class 类型。
- **返回值**：解析后的 Java 对象（类型为 `T`）。
- **示例**：
```java
String json = "{\"name\":\"张三\",\"age\":20}";
User user = JSON.parseObject(json, User.class);
```

### 1.2 parseObject（无类型参数）

- **作用**：将 JSON 字符串解析为 `JSONObject` 对象。
- **参数**：`String text`。
- **返回值**：`JSONObject` 实例。
- **示例**：
```java
JSONObject obj = JSON.parseObject(json);
```

### 1.3 parseArray

- **作用**：将 JSON 数组字符串解析为 Java 对象列表。
- **参数**：
  - `String text`：JSON 数组字符串。
  - `Class<T> clazz`：列表元素类型的 Class。
- **返回值**：`List<T>` 列表。
- **示例**：
```java
String jsonArray = "[{\"name\":\"张三\"},{\"name\":\"李四\"}]";
List<User> list = JSON.parseArray(jsonArray, User.class);
```

### 1.4 parseArray（无类型参数）

- **作用**：将 JSON 数组字符串解析为 `JSONArray` 对象。
- **参数**：`String text`。
- **返回值**：`JSONArray` 实例。
- **示例**：
```java
JSONArray arr = JSON.parseArray(jsonArray);
```

### 1.5 toJSONString

- **作用**：将 Java 对象序列化为 JSON 字符串。
- **参数**：
  - `Object object`：待序列化的对象。
  - `SerializerFeature... features`（可选）：序列化特性，如 `SerializerFeature.PrettyFormat` 格式化输出。
- **返回值**：JSON 字符串。
- **示例**：
```java
User user = new User("张三", 20);
String json = JSON.toJSONString(user);
// 带格式化
String prettyJson = JSON.toJSONString(user, SerializerFeature.PrettyFormat);
```

### 1.6 toJSONBytes

- **作用**：将 Java 对象序列化为 UTF-8 编码的字节数组。
- **参数**：`Object object`。
- **返回值**：`byte[]`。
- **示例**：
```java
byte[] bytes = JSON.toJSONBytes(user);
```

### 1.7 toJSON

- **作用**：将 Java 对象转换为 JSON 兼容的结构（`JSONObject` 或 `JSONArray`）。
- **参数**：`Object object`。
- **返回值**：`Object`，可能是 `JSONObject`、`JSONArray` 或基本类型。
- **示例**：
```java
Object jsonObj = JSON.toJSON(user);
if (jsonObj instanceof JSONObject) {
    // ...
}
```

### 1.8 parse

- **作用**：解析 JSON 字符串为 Java 对象（泛型，返回 `Object`），可根据内容自动返回 `JSONObject` 或 `JSONArray`。
- **参数**：`String text`。
- **返回值**：`Object`。
- **示例**：
```java
Object obj = JSON.parse(json);
if (obj instanceof JSONObject) { ... }
```

### 1.9 writeJSONString

- **作用**：将对象序列化后的 JSON 写入 `Writer`。
- **参数**：
  - `Writer writer`：输出 Writer。
  - `Object object`：待序列化对象。
- **返回值**：`void`。
- **示例**：
```java
StringWriter writer = new StringWriter();
JSON.writeJSONString(writer, user);
String json = writer.toString();
```

---

## 2. JSONObject 类

`JSONObject` 实现了 `Map<String, Object>` 接口，用于表示 JSON 对象。除了标准 `Map` 方法外，还提供了针对 JSON 的便捷方法。

### 2.1 构造方法

- `JSONObject()`：创建一个空的 JSONObject。
- `JSONObject(Map<String, Object> map)`：通过 Map 创建 JSONObject。

### 2.2 put / putAll

- **作用**：添加键值对。
- **参数**：
  - `String key`：键。
  - `Object value`：值，可以是任意类型（包括 JSONObject、JSONArray）。
- **返回值**：`put` 返回前一个值（`Object`），`putAll` 返回 `void`。
- **示例**：
```java
JSONObject obj = new JSONObject();
obj.put("name", "张三");
obj.put("age", 20);
```

### 2.3 getXxx 系列方法

用于安全获取值并转换为指定类型。如果 key 不存在或类型不匹配，可能返回 `null` 或抛出异常。

- `Object get(String key)`：返回原始值。
- `String getString(String key)`：获取字符串。
- `Integer getInteger(String key)`：获取 Integer。
- `int getIntValue(String key)`：获取 int 值，若为 null 则返回 0。
- `Long getLong(String key)` / `long getLongValue(String key)`
- `Double getDouble(String key)` / `double getDoubleValue(String key)`
- `Boolean getBoolean(String key)` / `boolean getBooleanValue(String key)`
- `Date getDate(String key)`：转换为 Date（根据字符串或时间戳）。
- `JSONObject getJSONObject(String key)`：获取 JSONObject。
- `JSONArray getJSONArray(String key)`：获取 JSONArray。
- `<T> T getObject(String key, Class<T> clazz)`：获取指定类型的对象。

**示例**：
```java
String name = obj.getString("name");
int age = obj.getIntValue("age");
JSONObject sub = obj.getJSONObject("address");
```

### 2.4 toJavaObject

- **作用**：将 JSONObject 转换为 Java Bean 对象。
- **参数**：`Class<T> clazz` 目标类型。
- **返回值**：`T` 实例。
- **示例**：
```java
User user = obj.toJavaObject(User.class);
```

### 2.5 parseObject（静态方法）

- **作用**：将 JSON 字符串直接解析为 JSONObject（同 `JSON.parseObject(String)`）。
- **参数**：`String text`。
- **返回值**：`JSONObject`。
- **示例**：
```java
JSONObject obj = JSONObject.parseObject(json);
```

### 2.6 其他常用 Map 方法

由于实现了 `Map`，因此也拥有以下方法：
- `int size()`
- `boolean isEmpty()`
- `boolean containsKey(Object key)`
- `boolean containsValue(Object value)`
- `Set<String> keySet()`
- `Collection<Object> values()`
- `Set<Entry<String, Object>> entrySet()`
- `Object remove(Object key)`
- `void clear()`
- `JSONObject clone()`：深拷贝。

### 2.7 toString

- **作用**：将 JSONObject 序列化为 JSON 字符串（等同于 `JSON.toJSONString(this)`）。
- **返回值**：`String`。
- **示例**：
```java
String json = obj.toString();
```

### 2.8 fluentPut / fluentRemove

- **作用**：链式调用的 put / remove，返回自身。
- **示例**：
```java
obj.fluentPut("a", 1).fluentPut("b", 2);
```

---

## 3. JSONArray 类

`JSONArray` 实现了 `List<Object>` 接口，用于表示 JSON 数组。

### 3.1 构造方法

- `JSONArray()`：创建一个空数组。
- `JSONArray(List list)`：通过 List 创建 JSONArray。

### 3.2 add / addAll

- **作用**：添加元素到数组。
- **参数**：`Object element`（可以是任意类型）。
- **返回值**：`boolean`（`add`）或 `void`（`addAll`）。
- **示例**：
```java
JSONArray arr = new JSONArray();
arr.add("first");
arr.add(123);
arr.add(new JSONObject().fluentPut("key", "value"));
```

### 3.3 getXxx 系列方法

与 JSONObject 类似，通过索引获取并转换类型：
- `Object get(int index)`
- `String getString(int index)`
- `Integer getInteger(int index)`
- `int getIntValue(int index)`
- `Long getLong(int index)` / `long getLongValue(int index)`
- `Double getDouble(int index)` / `double getDoubleValue(int index)`
- `Boolean getBoolean(int index)` / `boolean getBooleanValue(int index)`
- `Date getDate(int index)`
- `JSONObject getJSONObject(int index)`
- `JSONArray getJSONArray(int index)`
- `<T> T getObject(int index, Class<T> clazz)`

**示例**：
```java
String first = arr.getString(0);
JSONObject obj = arr.getJSONObject(2);
```

### 3.4 toJavaList

- **作用**：将 JSONArray 转换为 Java List 对象（元素类型为指定 Class）。
- **参数**：`Class<T> clazz`。
- **返回值**：`List<T>`。
- **示例**：
```java
List<User> list = arr.toJavaList(User.class);
```

### 3.5 parseArray（静态方法）

- **作用**：将 JSON 字符串解析为 JSONArray（同 `JSON.parseArray(String)`）。
- **参数**：`String text`。
- **返回值**：`JSONArray`。
- **示例**：
```java
JSONArray arr = JSONArray.parseArray(jsonArrayString);
```

### 3.6 其他 List 方法

实现了 `List`，因此拥有：
- `int size()`
- `boolean isEmpty()`
- `Iterator<Object> iterator()`
- `Object[] toArray()`
- `void clear()`
- `Object remove(int index)`
- 等等。

### 3.7 toString

- **作用**：序列化为 JSON 字符串。
- **返回值**：`String`。
- **示例**：
```java
String json = arr.toString();
```

---

## 4. JSONPath 类

用于在 JSON 结构中执行 XPath 风格的查询。

### 4.1 of

- **作用**：编译 JSONPath 表达式，创建 JSONPath 实例。
- **参数**：`String path` 表达式。
- **返回值**：`JSONPath` 实例。
- **示例**：
```java
JSONPath path = JSONPath.of("$.store.book[0].title");
```

### 4.2 eval

- **作用**：在给定 JSON 对象（可以是 Java 对象、JSONObject、JSONArray 等）上计算 JSONPath，返回匹配的结果。
- **参数**：`Object rootObject` 根对象。
- **返回值**：`Object` 匹配的值（可能是单个值、集合等）。
- **示例**：
```java
Object result = path.eval(jsonObject);
```

### 4.3 extract

- **作用**：直接从 JSON 字符串或 JSONReader 中提取值，无需完全解析成对象。
- **参数**：`JSONReader jsonReader` 或 `String json`。
- **返回值**：`Object`。
- **示例**：
```java
JSONReader reader = JSONReader.of(jsonString);
Object value = JSONPath.extract(reader, "$.name");
```

### 4.4 set

- **作用**：通过 JSONPath 设置值。
- **参数**：
  - `Object rootObject` 根对象。
  - `Object value` 要设置的值。
- **返回值**：`void` 或可能返回是否成功。
- **示例**：
```java
JSONPath.set(jsonObject, "$.name", "李四");
```

### 4.5 remove

- **作用**：删除 JSONPath 匹配的元素。
- **参数**：`Object rootObject`。
- **返回值**：`boolean` 表示是否删除了元素。
- **示例**：
```java
boolean removed = JSONPath.remove(jsonObject, "$.items[0]");
```

### 4.6 contains

- **作用**：检查路径是否存在。
- **参数**：`Object rootObject`。
- **返回值**：`boolean`。
- **示例**：
```java
boolean exists = JSONPath.contains(jsonObject, "$.name");
```

---

## 5. JSONB 类

提供 JSONB（二进制 JSON）格式的序列化/反序列化，性能更高。

### 5.1 parseObject

- **作用**：将 JSONB 字节数组解析为 Java 对象。
- **参数**：
  - `byte[] jsonbBytes`：JSONB 格式的字节数组。
  - `Class<T> clazz`：目标类型。
- **返回值**：`T`。
- **示例**：
```java
User user = JSONB.parseObject(bytes, User.class);
```

### 5.2 toBytes

- **作用**：将 Java 对象序列化为 JSONB 字节数组。
- **参数**：`Object object`。
- **返回值**：`byte[]`。
- **示例**：
```java
byte[] bytes = JSONB.toBytes(user);
```

### 5.3 parseArray（JSONB）

- **作用**：将 JSONB 字节数组解析为 List。
- **参数**：`byte[] jsonbBytes, Class<T> clazz`。
- **返回值**：`List<T>`。
- **示例**：
```java
List<User> list = JSONB.parseArray(bytes, User.class);
```

---

## 6. @JSONField 注解

用于定制字段的序列化/反序列化行为。可标注在字段或 getter/setter 方法上。

| 注解字段             | 类型                  | 作用                                                                                  |
| ---------------- | ------------------- | ----------------------------------------------------------------------------------- |
| ordinal          | int                 | 是根据fieldName的字母序进行序列的，你可以通过ordinal指定字段的顺序                                           |
| name             | String              | 序列化和反序列化时候的别名                                                                       |
| format           | String              | 用于字符串格式的日期转换                                                                        |
| serialize        | boolean             | 是否参与序列化                                                                             |
| deserialize      | boolean             | 是否参与反序列化                                                                            |
| serialzeFeatures | SerializerFeature[] | 序列化选项 SerializerFeature.WriteNullNumberAsZero 如空Number填充0                           |
| parseFeatures    | Feature[]           | 反序列化选项                                                                              |
| label            | String              | 标签                                                                                  |
| jsonDirect       | boolean             | 当你有⼀个字段是json字符串的数据，你希望直接输出，⽽不是经过转义之后再输出。                                            |
| serializeUsing   | `Class<?>`          | 属性的序列化类，可定制。可有现存的，比如本来是Long，序列化的时候转为String：serializeUsing= ToStringSerializer.class |
| deserializeUsing | `Class<?>`          | 属性的反序列化类，可定制。                                                                       |
| alternateNames   | String[]            | 参与反序列化时候的别名                                                                         |
| unwrapped        | boolean             | 对象映射到父对象上。不进行子对象映射。简单而言，就是属性为对象的时候，属性对象里面的属性直接输出当做父对象的属性输出                          |
| defaultValue     | String              | 设置默认值                                                                               |

### 6.1 常用属性

- `name`：序列化后的字段名。
- `format`：日期格式（如 `"yyyy-MM-dd HH:mm:ss"`）。
- `ordinal`：序列化时的顺序（数值越小越靠前）。
- `serialize`：是否参与序列化（默认 `true`）。
- `deserialize`：是否参与反序列化（默认 `true`）。
- `serialzeFeatures`：序列化特性数组，例如 `SerializerFeature.WriteNullNumberAsZero`。
- `parseFeatures`：反序列化特性数组。
- `label`：分组标签，可用于选择性序列化。
- `jsonDirect`：若字段值为 JSON 字符串，是否直接输出为 JSON 结构而不转义。
- `defaultValue`：默认值，当字段值为 null 时使用。
- `alternateNames`：反序列化时可选的其他名称。
- `unwrapped`：是否将对象属性平铺到父对象中。

**示例**：
```java
public class User {
    @JSONField(name = "userName")
    private String name;
    
    @JSONField(ordinal = 1, format = "yyyy-MM-dd")
    private Date birthDate;
    
    @JSONField(serialize = false)
    private String password;
    
    @JSONField(deserialize = false)
    private String internalCode;
}
```


比较常用的

> ordinal 、name 、serialize、 deserialize、 format、defaultValue

```java
public class JSONController {
    public static void main(String[] args) {
        Nation nationBean1 = Nation.builder().dress("现代服饰").num(1314).build();
        String str = JSON.toJSONString(nationBean1);
        System.out.println(str);                            //{"name":"汉族","number":1314}
        Nation nation = JSON.parseObject(str, Nation.class);
        System.out.println(JSON.toJSONString(nation));      //{"name":"汉族"}
    }
}

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class Nation {
    @JSONField(defaultValue = "汉族")
    private String name;

    @JSONField(ordinal = 1, name = "DRESS", serialize = false)
    private String dress;

    @JSONField(ordinal = 2, name = "number", deserialize = false)
    private Integer num;

    @JSONField(ordinal = 3, format = "yyyy-MM-dd")
    private Date celebrateHoliday;
}

```

> > serialzeFeatures、parseFeatures
>
> 他们是序列化、反序列化时候的一些可选的特征：
>
> 序列化的时候
> 比如fastjson默认是不会将为null的属性输出的，若是我们也想输出，可以加入@JSONField(serialzeFeatures = SerializerFeature.WriteMapNullValue)。
> 还有就是，数值型为null的话，就输出0，可以使用@JSONField(serialzeFeatures = SerializerFeature.WriteNullNumberAsZero)
>
> 反序列化的时候，
> 比如parser是否将允许使用非双引号属性名字。@JSONField(parseFeatures = Feature.AllowSingleQuotes)

```java
public class JSONController {
    public static void main(String[] args) {
        Nation nationBean1 = Nation.builder().name("汉族").build();
        String str = JSON.toJSONString(nationBean1);
        System.out.println(str);
        //{"celebrateHoliday":null,"name":"汉族","num":0}
    }
}

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class Nation {
    private String name;
    private String dress;

    @JSONField(serialzeFeatures = SerializerFeature.WriteNullNumberAsZero)
    private Integer num;

    @JSONField(serialzeFeatures = SerializerFeature.WriteMapNullValue)
    private Date celebrateHoliday;
}

```

具体有：
名称 含义

```
QuoteFieldNames 输出key时是否使用双引号,默认为true
UseSingleQuotes 使用单引号而不是双引号,默认为false
WriteMapNullValue 是否输出值为null的字段,默认为false
WriteEnumUsingToString Enum输出name()或者original,默认为false
UseISO8601DateFormat Date使用ISO8601格式输出，默认为false
WriteNullListAsEmpty List字段如果为null,输出为[],而非null
WriteNullStringAsEmpty 字符类型字段如果为null,输出为”“,而非null
WriteNullNumberAsZero 数值字段如果为null,输出为0,而非null
WriteNullBooleanAsFalse Boolean字段如果为null,输出为false,而非null
SkipTransientField 如果是true，类中的Get方法对应的Field是transient，序列化时将会被忽略。默认为true
SortField 按字段名称排序后输出。默认为false
WriteTabAsSpecial 把\t做转义输出，默认为false不推荐设为true
PrettyFormat 结果是否格式化,默认为false
WriteClassName 序列化时写入类型信息，默认为false。反序列化是需用到
DisableCircularReferenceDetect 消除对同一对象循环引用的问题，默认为false
WriteSlashAsSpecial 对斜杠’/’进行转义
BrowserCompatible 将中文都会序列化为\uXXXX格式，字节数会多一些，但是能兼容IE 6，默认为false
WriteDateUseDateFormat 全局修改日期格式,默认为false。
DisableCheckSpecialChar 一个对象的字符串属性中如果有特殊字符如双引号，将会在转成json时带有反斜杠转移符。如果不需要转义，可以使用这个属性。默认为false
BeanToArray 将对象转为array输出
```

> > 3、label
>
> 可以给属性设置标签，这样可以批量处理某一类的属性，比如不序列化某一类属性。

```java
public class JSONController {
    public static void main(String[] args) {
        Nation nationBean1 = Nation.builder().name("汉族").dress("便服").num(12).celebrateHoliday(new Date()).build();
        String str = JSON.toJSONString(nationBean1, Labels.includes("a"));
        System.out.println(str); //{"num":12}
        String str2 = JSON.toJSONString(nationBean1, Labels.excludes("a"));
        System.out.println(str2); //{"celebrateHoliday":1598929877786,"dress":"便服","name":"汉族"}
    }
}

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class Nation {
    private String name;

    private String dress;

    @JSONField(label = "a")
    private Integer num;

    @JSONField(label = "b")
    private Date celebrateHoliday;
}

```

> > 4、jsonDirect
>
> 它的作用是：当你有⼀个字段是json字符串的数据，你希望直接输出，而不是经过转义之后再输出。

```java
public class JSONController {
    public static void main(String[] args) {
        Nation nationBean1 = Nation.builder().name("{}").dress("{}").build();
        String str = JSON.toJSONString(nationBean1);
        System.out.println(str); //{"dress":"{}","name":{}}

    }
}

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class Nation {
    @JSONField(jsonDirect = true)
    private String name;
    @JSONField(jsonDirect = false)
    private String dress;
    private Integer num;
    private Date celebrateHoliday;
}

```

> > 5、serializeUsing和deserializeUsing
>
> 可定制的序列化和反序列化的类，但是也有原生的。
> 比如原生：比如字段本来是Long，序列化的时候转为String。
> 比如自定义：我对某个字段加上我想要的处理结果“中国的”

```java
public class JSONController {
    public static void main(String[] args) {
        Nation nationBean1 = Nation.builder().name("汉族").num(2323).build();
        String str = JSON.toJSONString(nationBean1);
        System.out.println(str);
        //{"name":"中国的汉族","num":"2323"}

    }

    public static class MySerializer implements ObjectSerializer {
        @Override
        public void write(JSONSerializer serializer, Object object, Object fieldName, Type fieldType, int features) throws IOException {
            String text = "中国的" + (String) object;
            serializer.write(text);
        }
    }
}

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class Nation {
    @JSONField(serializeUsing = JSONController.MySerializer.class)
    private String name;
    private String dress;
    @JSONField(serializeUsing = ToStringSerializer.class)
    private Integer num;
    private Date celebrateHoliday;
}

```

> > 6、alternateNames
>
> 反序列化时候的别名

```java
public class JSONController {
    public static void main(String[] args) {
        String str ="{\"Name\":\"汉族\",\"num\":2323}";
        System.out.println(JSON.toJSONString(JSON.parseObject(str, Nation.class)));
        //{"name":"汉族","num":2323}
    }

}

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class Nation {
    @JSONField(alternateNames = {"name", "Name"})
    private String name;
    private String dress;
    private Integer num;
    private Date celebrateHoliday;
}

```

> > 7、unwrapped
>
> 对象映射到父对象上。不进行子对象映射。简单而言，就是属性为对象的时候，属性对象里面的属性直接输出当做父对象的属性输出

```java
public class JSONController {
    public static void main(String[] args) {
        QSM qsm = new QSM();
        qsm.setName("传闻中的陈芊芊");
        qsm.setCity("花垣城");
        QSM qsm2 = new QSM();
        qsm2.setName("传闻中的韩烁");
        qsm2.setCity("玄虎城");

        Nation nation1 = Nation.builder().name("中国").qsm(qsm).qsm2(qsm2).build();
        System.out.println(JSON.toJSONString(nation1));
        //{"name":"中国","city":"花垣城","name":"传闻中的陈芊芊","qsm2":{"city":"玄虎城","name":"传闻中的韩烁"}}
    }

}

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
class Nation {
    private String name;

    @JSONField(unwrapped = true)
    private QSM qsm;

    @JSONField(unwrapped = false)
    private QSM qsm2;
}

@Data
class QSM {
    String name;
    String city;
}

```


## 多层JSON解析

> - “key”:“value” --> 此时value为String
> - “key":0 --> 此时value为int
> - “key”:{“k1”:“v1”} --> 此时value为JSONObject
> - “key”:[v] -->此时value为JSONArray

- 以下举例数据结构：

```java
{
    "error": 0,
    "status": "success",
    "results": [
        {
            "currentCity": "青岛",
            "index": [
                {
                    "title": "穿衣",
                    "zs": "较冷",
                    "tipt": "穿衣指数",
                    "des": "建议着厚外套加毛衣等服装。年老体弱者宜着大衣、呢外套加羊毛衫。"
                },
                {
                    "title": "紫外线强度",
                    "zs": "中等",
                    "tipt": "紫外线强度指数",
                    "des": "属中等强度紫外线辐射天气，外出时建议涂擦SPF高于15、PA+的防晒护肤品，戴帽子、太阳镜。"
                }
            ]
        }
    ]
}
```

- json解析代码：

```java
public class Test {
public static void main(String[] args) {
    String s = "{\"error\":0,\"status\":\"success\",\"results\":[{\"currentCity\":\"青岛\",\"index\":[{\"title\":\"穿衣\",\"zs\":\"较冷\",\"tipt\":\"穿衣指数\",\"des\":\"建议着厚外套加毛衣等服装。年老体弱者宜着大衣、呢外套加羊毛衫。\"},{\"title\":\"紫外线强度\",\"zs\":\"最弱\",\"tipt\":\"紫外线强度指数\",\"des\":\"属弱紫外线辐射天气，无需特别防护。若长期在户外，建议涂擦SPF在8-12之间的防晒护肤品。\"}],}]}";

    JSONObject jsonObject = JSONObject.fromObject(s);

    //提取出error为 0
    int error = jsonObject.getInt("error");
    System.out.println("error:" + error);

    //提取出status为 success
    String status = jsonObject.getString("status");
    System.out.println("status:" + status);    

    //注意：results中的内容带有中括号[]，所以要转化为JSONArray类型的对象
    JSONArray result = jsonObject.getJSONArray("results");

    for (int i = 0; i < result.size(); i++) {
        //提取出currentCity为 青岛
        String currentCity = result.getJSONObject(i).getString("currentCity");
        System.out.println("currentCity:" + currentCity);

        //注意：index中的内容带有中括号[]，所以要转化为JSONArray类型的对象
        JSONArray index = result.getJSONObject(i).getJSONArray("index");

        for (int j = 0; j < index.size(); j++) {
            String title = index.getJSONObject(j).getString("title");
            System.out.println("title:" + title);
            String zs = index.getJSONObject(j).getString("zs");
            System.out.println("zs:" + zs);
            String tipt = index.getJSONObject(j).getString("tipt");
            System.out.println("tipt:" + tipt);
            String des = index.getJSONObject(j).getString("des");
            System.out.println("des:" + des);
        }
    }
}
}

```


# Jackson

## 依赖

- jackson-core：核心包，定义了低级流（Streaming）API，提供基于"流模式"解析。Jackson内部实现正是通过高性能的流模式API的JsonGenerator和JsonParser来生成和解析json。
- jackson-annotations，注解（Annotations）包，提供标准的Jackson注解功能；
- jackson-databind：数据绑定（Databind）包，实现了数据绑定（和对象序列化）支持，它依赖于Streaming和Annotations包。提供基于“对象绑定”解析的API（ObjectMapper）和"树模型"解析的API（JsonNode）；基于"对象绑定"解析的API和"树模型"解析的API依赖基于“流模式”解析的API。

**通常情况下，我们单独使用时，根据需要通过Maven引入jackson-databind、jackson-core和jackson-annotations即可。**

```xml
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-core</artifactId>
  <version>2.9.6</version>
</dependency>

<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-annotations</artifactId>
  <version>2.9.6</version>
</dependency>

<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
  <version>2.9.6</version>
</dependency>

```

下面看一下不同环境下相关组件的依赖引入情况。

在SpringBoot当中，spring-boot-starter-web间接引入了Jackson组件，也就是如果你使用了SpringBoot框架，那么你的项目中已经有了Jackson依赖。下面的依赖省略了version和scope项。

```text
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

web starter中依赖了json starter：

```text
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-json</artifactId>
</dependency>
```

springboot中集成

```
#指定日期格式，比如yyyy-MM-dd HH:mm:ss，或者具体的格式化类的全限定名
spring.jackson.date-format 
#是否开启Jackson的反序列化
spring.jackson.deserialization
#是否开启json的generators.
spring.jackson.generator
#指定Joda date/time的格式，比如yyyy-MM-ddHH:mm:ss). 如果没有配置的话，dateformat会作为backup
spring.jackson.joda-date-time-format
#指定json使用的Locale.
spring.jackson.locale
#是否开启Jackson通用的特性.
spring.jackson.mapper
#是否开启jackson的parser特性.
spring.jackson.parser
#指定PropertyNamingStrategy(CAMEL_CASE_TO_LOWER_CASE_WITH_UNDERSCORES)或者指定PropertyNamingStrategy子类的全限定类名.
spring.jackson.property-naming-strategy
#是否开启jackson的序列化.
spring.jackson.serialization
#指定序列化时属性的inclusion方式，具体查看JsonInclude.Include枚举.
spring.jackson.serialization-inclusion
#指定日期格式化时区，比如America/Los_Angeles或者GMT+10.
spring.jackson.time-zone
```

## 注解

### 序列化

| 名字               | 含义                                                         |
| ------------------ | ------------------------------------------------------------ |
| @JsonAnyGetter     | 该注解用于把可变的`Map`类型属性当做标准属性                  |
| @JsonGetter        | 该注解是`@JsonProperty`的两个作用中的一个, 用来标记一个方法是`getter`方法 |
| @JsonPropertyOrder | 该注解可以指定实体属性序列化后的顺序                         |
| @JsonRawValue      | 该注解可以让Jackson在序列化时把属性的值原样输出              |
| @JsonValue         | 该注解作用于一个方法, 并且只用被注解的方法序列化整个实体对象 |
| @JsonRootName      | 如果`wrapping`是使能(`enabled`), 那么该注解用来指定`root wrapper`的名称 |
| @JsonSerialize     | 该注解用于指定一个自定义序列化器(`custom serializer`)来序列化实体例的某属性 |

#### 1.1 @JsonAnyGetter

该注解用于把可变的`Map`类型属性当做标准属性。
下例中，`ExtendableBean`实体有一个`name`属性和一组`kay/value`格式的可扩展属性:

```java
class ExtendableBean {
    public String name;
    public Map<String, String> properties;
    @JsonAnyGetter
    public Map<String, String> getProperties() {
        return properties;
    }
    public ExtendableBean(String name) {
        this.name = name;
        properties = new HashMap<>();
    }
    public void add(String key, String value){
        properties.put(key, value);
    }
}
```

**说明:** `name`属性访问级别是`public`, 是为了省略`get/set`方法, 简化示例
下面是把`ExtendableBean`实体序列化的过程:

```java
private static void whenSerializingUsingJsonAnyGetter_thenCorrect(){
        ExtendableBean bean = new ExtendableBean("My bean");
        bean.add("attr1", "val1");
        bean.add("attr2", "val2");
        String result = null;
        try {
            result = new ObjectMapper().writeValueAsString(bean);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        System.out.println(result);
    }

```

序列化后的结果:` {"name":"My bean","attr2":"val2","attr1":"val1"}`

#### 1.2 @JsonGetter

该注解是`@JsonProperty`的两个作用中的一个, 用来标记一个方法是`getter`方法
下例中, 指定方法`getTheName()`是属性`name`属性的`getter`方法

```java
public class MyBean {
    public int id;
    private String name;
 
    @JsonGetter("name")
    public String getTheName() {
        return name;
    }
}
```

下面是序列化过程:

```java
public void whenSerializingUsingJsonGetter_thenCorrect()
  throws JsonProcessingException {
    MyBean bean = new MyBean(1, "My bean");
    String result = new ObjectMapper().writeValueAsString(bean);
}
```

#### 1.3 @JsonPropertyOrder

该注解可以指定实体属性序列化后的顺序

```java 
@JsonPropertyOrder({ "name", "id" })
public class MyBean {
    public int id;
    public String name;
}

```

- 序列化后的结果:`{ "name":"My bean", "id":1}`
- 该注解有一个参数`alphabetic`, 如果为`true`, 表示按字母顺序序列化,此时输出结果:`{ "id":1, "name":"My bean"}`

#### 1.4 @JsonRawValue

该注解可以让Jackson在序列化时把属性的值原样输出
下面的例子中, 我们给实体属性`attrs`赋值一个json字符串

```java
public class RawBean {
    public String name;
    @JsonRawValue
    public String attrs;
}
public void whenSerializingUsingJsonRawValue_thenCorrect()
  throws JsonProcessingException {  
    RawBean bean = new RawBean("My bean", "{\"attr\":false}");
    String result = new ObjectMapper().writeValueAsString(bean);
}

```

输出结果是: `{"name":"Mybean","attrs":{"attr":false}}`

#### 1.5 @JsonValue

该注解作用于一个方法, 并且只用被注解的方法序列化整个实体对象
把1.1的实体例修改如下

```java
class ExtendableBean {
   ...........
   //把注解换成JsonValue
    @JsonValue
    public Map<String, String> getProperties() {
        return properties;
    }
	..........
}
```

序列化过程不变, 则结果是: `{"attr2":"val2","attr1":"val1"}`
**可见, 属性`name`没有被序列化**

#### 1.6 @JsonRootName

如果wrapping是使能(enabled), 那么该注解用来指定root wrapper的名称
wrapping(包装)的含义是如果序列化实体User的结果是

```
{
    "id": 1,
    "name": "John"
}
```

那么wrapping后的效果如下:

```
{
    "User": {
        "id": 1,
        "name": "John"
    }
}
```

下面看一个例子, 我们用该注解指明包装实体(wrapper entity)的包装器名称:

```java
@JsonRootName(value = "user")
public class UserWithRoot {
    public int id;
    public String name;
}
```

包装器默认名称是实体类名, 这里就是UserWithRoot, 但是注解的value属性把包装器名称改为了user
序列化过程(和前面不同, 需要使能包装器)

```java
private static void whenSerializingUsingJsonRootName_thenCorrect(){
        UserWithRoot user = new UserWithRoot();
        user.id = 1;
        user.name = "jackma";
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.enable(SerializationFeature.WRAP_ROOT_VALUE);
            String result = objectMapper.writeValueAsString(user);
            System.out.println(result);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
```

序列化的结果:{"user":{"id":1,"name":"jackma"}}
从Jackson .2.4版本开始, 新增了一个可选参数namespace, 该属性对json没效果, 但是对xml起作用, 修改本例的实体例:

```
@JsonRootName(value = "user", namespace = "alibaba")
class UserWithRoot {
    public int id;
    public String name;
}
```

用XmlMapper序列化:

```
private static void whenSerializingUsingJsonRootName_thenCorrect(){
		..............
            XmlMapper xmlMapper = new XmlMapper();
            xmlMapper.enable(SerializationFeature.WRAP_ROOT_VALUE);
		..............
```

序列化结果:

```
<user xmlns="alibaba">
	<id xmlns="">1</id>
	<name xmlns="">jackma</name>
</user>
```

#### 1.7 @JsonSerialize

该注解用于指定一个自定义序列化器(`custom serializer`)来序列化实体例的某属性
下例中, 用`@JsonSerialize`的参数`using`指明实体类属性`eventDate`的序列化器是`CustomDateSerializer`类:

```java
public class Event {
    public String name;
 
    @JsonSerialize(using = CustomDateSerializer.class)
    public Date eventDate;
}
```

下面是类CustomDateSerializer的定义:

```java
public class CustomDateSerializer extends StdSerializer<Date> {
    private static SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy hh:mm:ss");
    public CustomDateSerializer() { this(null); } 
    public CustomDateSerializer(Class<Date> t) { super(t); }
    @Override
    public void serialize(Date value, JsonGenerator gen, SerializerProvider arg2) 
    	throws IOException, JsonProcessingException {
        gen.writeString(formatter.format(value));
    }
}
```

序列化:

```java
public void whenSerializingUsingJsonSerialize_thenCorrect(){
	SimpleDateFormat df = new SimpleDateFormat("yyyy/MM/DD hh:mm:ss");
	String toParse = "2019/08/19 16:28:00";
	Date date = null;
	try {
	    date = df.parse(toParse);
	} catch (ParseException e) {
	    e.printStackTrace();
	}
	Event event = new Event();
	event.name = "party";
	event.eventDate = date;
	try {
	    String result = new ObjectMapper().writeValueAsString(event);
	    System.out.println(result);
	} catch (JsonProcessingException e) {
	    e.printStackTrace();
	}
}
```

序列化结果: {"name":"party","eventDate":"2019-08-19 04:28:00"}
而如果没有@JsonSerialize注解的序列化结果是: {"name":"party","eventDate":1566203280000}

### 反序列化

#### 2.1 @JsonCreator

该注解可以调整反序列化时`构造器/构造工厂`的行为
当我们需要反序列化的Json字符串和目标实体类不完全匹配时, 这个注解非常有用
假设我们要反序列化下面的Json字符串:

```
{
    "id":1,
    "theName":"My bean"
}
```

但是, 我们的目标实体类并没有一个名为`theName`的属性. 现在, 我们不想改变实体类本身, 我们只需在数据导出时做一些控制, 方法就是在构造器中使用`@JsonCreator`和`@JsonProperty`注解:

```java
public class BeanWithCreator {
    public int id;
    public String name;
 
    @JsonCreator
    public BeanWithCreator(
      @JsonProperty("id") int id, 
      @JsonProperty("theName") String name) {
        this.id = id;
        this.name = name;
    }
}
```

反序列化

```java
public void whenDeserializingUsingJsonCreator_thenCorrect()  throws IOException {
    String json = "{\"id\":1,\"theName\":\"My bean\"}";
    BeanWithCreator bean = new ObjectMapper().readerFor(BeanWithCreator.class).readValue(json);
    assertEquals("My bean", bean.name);
}
```

#### 2.2 @JacksonInject

该注解指明一个属性的值是通过注入得到而不是从Json字符串反序列得到
下例的实体例属性id的值用注解标明是注入值:

```java
public class BeanWithInject {
    @JacksonInject
    public int id;
     
    public String name;
}
```


反序列化过程:

```java
public void whenDeserializingUsingJsonInject_thenCorrect() throws IOException {
    String json = "{\"name\":\"My bean\"}";     
    InjectableValues inject = new InjectableValues.Std().addValue(int.class, 1);
    BeanWithInject bean = new ObjectMapper().reader(inject).forType(BeanWithInject.class).readValue(json);     
    assertEquals("My bean", bean.name);
    assertEquals(1, bean.id);
}
```

#### 2.3 @JsonAnySetter

该注解允许我们把一个可变的`map`属性作为标准属性, 在反序列过程中, 从Json字符串得到的属性值会加入到`map`属性中
实体例和注解:

```java
public class ExtendableBean {
    public String name;
    private Map<String, String> properties;
 
    @JsonAnySetter
    public void add(String key, String value) {
        properties.put(key, value);
    }
}
```

准备反序列化的Json字符串:

```json
{
    "name":"My bean",
    "attr2":"val2",
    "attr1":"val1"
}
```

反序列化过程:

```java
public void whenDeserializingUsingJsonAnySetter_thenCorrect()  throws IOException {
    String json = "{\"name\":\"My bean\",\"attr2\":\"val2\",\"attr1\":\"val1\"}"; 
    ExtendableBean bean = new ObjectMapper().readerFor(ExtendableBean.class).readValue(json);     
    assertEquals("My bean", bean.name);
    assertEquals("val2", bean.getProperties().get("attr2"));
}
```

#### 2.4 @JsonSetter

该注解是@JsonProperty的另一个作用, 和@JsonGetter相对, 标记一个方法是setter方法
如果目标实体类没有和Json字符串数据完全匹配的方法时, 我们可以通过这个注解做一些调整让他们匹配
下例中指定方法setTheName()作为name属性的setter方法

```java
public class MyBean {
    public int id;
    private String name;
 
    @JsonSetter("name")
    public void setTheName(String name) {
        this.name = name;
    }
}
```

反序列化过程:

```java
public void whenDeserializingUsingJsonSetter_thenCorrect()  throws IOException {  
    String json = "{\"id\":1,\"name\":\"My bean\"}"; 
    MyBean bean = new ObjectMapper().readerFor(MyBean.class).readValue(json);
    assertEquals("My bean", bean.getTheName());
}
```

#### 2.5 @JsonDeserialize

该注解标明使用自定义反序列化器(`custom deserializer`)
实体类:

```java
public class Event {
    public String name;
 
    @JsonDeserialize(using = CustomDateDeserializer.class)
    public Date eventDate;
}
```

自定义反序列化器:

```java
public class CustomDateDeserializer  extends StdDeserializer<Date> { 
    private static SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy hh:mm:ss");
     public CustomDateDeserializer() { 
        this(null); 
    }  
    public CustomDateDeserializer(Class<?> vc) { 
        super(vc); 
    }
    @Override
    public Date deserialize(JsonParser jsonparser, DeserializationContext context) throws IOException {         
        String date = jsonparser.getText();
        try {
            return formatter.parse(date);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
}
```

反序列过程:

```java
public void whenDeserializingUsingJsonDeserialize_thenCorrect()  throws IOException {  
    String json = "{"name":"party","eventDate":"20-12-2014 02:30:00"}"; 
    SimpleDateFormat df = new SimpleDateFormat("dd-MM-yyyy hh:mm:ss");
    Event event = new ObjectMapper().readerFor(Event.class).readValue(json);     
    assertEquals("20-12-2014 02:30:00", df.format(event.eventDate));
}
```

#### 2.6 @JsonAlias

该注解在反序列化过程中为属性定义一个或多个别名
实体类:

```java
public class AliasBean {
    @JsonAlias({ "fName", "f_name" })
    private String firstName;   
    private String lastName;
}
```

Json字符串中`fName`, `f_name`或`firstName`的值都可以被反序列到属性`firstName`

```java
public void whenDeserializingUsingJsonAlias_thenCorrect() throws IOException {
    String json = "{\"fName\": \"John\", \"lastName\": \"Green\"}";
    AliasBean aliasBean = new ObjectMapper().readerFor(AliasBean.class).readValue(json);
    assertEquals("John", aliasBean.getFirstName());
}
```

### 属性包含注解

#### 3.1 @JsonIgnoreProperties

该注解是一个**类级别**的注解, 标记一个或多个属性被Jackson**忽略**
实体类:

```java
@JsonIgnoreProperties({ "id" })
public class BeanWithIgnore {
    public int id;
    public String name;
}
```

序列化过程:

```java
public void whenSerializingUsingJsonIgnoreProperties_thenCorrect()  throws JsonProcessingException {  
    BeanWithIgnore bean = new BeanWithIgnore(1, "My bean"); 
    String result = new ObjectMapper().writeValueAsString(bean);     
    assertThat(result, containsString("My bean"));
    assertThat(result, not(containsString("id")));
}
```

- 参数`ignoreUnknown`为`true`时, Json字符串如果有未知的属性名, 则不会抛出异常
- 序列化时，`@JsonIgnoreProperties({"prop1", "prop2"})`忽略列出的属性
- 反序列化时，`@JsonIgnoreProperties(ignoreUnknown=true)`忽略没有 getter/setter 的属性

#### 3.2 @JsonIgnore

该注解用于**属性级别**, 用于标明一个属性可以被Jackson**忽略**

```java
public class BeanWithIgnore {
    @JsonIgnore
    public int id;
 
    public String name;
}
```

序列化过程:

```java
public void whenSerializingUsingJsonIgnore_thenCorrect()
  throws JsonProcessingException {
  
    BeanWithIgnore bean = new BeanWithIgnore(1, "My bean");
 
    String result = new ObjectMapper()
      .writeValueAsString(bean);
     
    assertThat(result, containsString("My bean"));
    assertThat(result, not(containsString("id")));
}
```

#### 3.3 @JsonIgnoreType

该注解标记类型是注解作用的类型的属性都会被忽略
**必须作用于类, 标明以该类为类型的属性都会被Jackson忽略**
实体类:

```java
public class User {
    public int id;
    public Name name;
 
    @JsonIgnoreType
    public static class Name {
        public String firstName;
        public String lastName;
    }
}
```

序列化过程:

```java
public void whenSerializingUsingJsonIgnoreType_thenCorrect()  throws JsonProcessingException, ParseException {  
    User.Name name = new User.Name("John", "Doe");
    User user = new User(1, name); 
    String result = new ObjectMapper().writeValueAsString(user); 
    assertThat(result, containsString("1"));
    assertThat(result, not(containsString("name")));
    assertThat(result, not(containsString("John")));
}
```

#### 3.4 @JsonInclude

该注解在序列化时会排除属性值是空值（empty或null）、没有默认值的属性。
**可作用在类和属性上**
实体类：

```java
@JsonInclude(Include.NON_NULL)
public class MyBean {
    public int id;
    public String name;
}
```

序列化过程:

```java
public void whenSerializingUsingJsonInclude_thenCorrect()  throws JsonProcessingException {  
    MyBean bean = new MyBean(1, null); 
    String result = new ObjectMapper().writeValueAsString(bean);     
    assertThat(result, containsString("1"));
    assertThat(result, not(containsString("name")));
}
```

#### 3.5 @JsonAutoDetect

该注解可以覆盖属性是否可见的默认语义, 比如对于不可见的`private`序列化时变成可见的
实体类:

```java
@JsonAutoDetect(fieldVisibility = Visibility.ANY)
public class PrivateBean {
    private int id;
    private String name;
}
```

序列化过程:

```java
public void whenSerializingUsingJsonAutoDetect_thenCorrect()  throws JsonProcessingException {
    PrivateBean bean = new PrivateBean(1, "My bean"); 
    String result = new ObjectMapper().writeValueAsString(bean);     
    assertThat(result, containsString("1"));
    assertThat(result, containsString("My bean"));
}
```

### 4 常用注解

#### 4.1 @JsonProperty

该注解可以指定属性在Json字符串中的名字
下例中在非标准的`setter`和`getter`方法上使用该注解, 可以成功序列化和反序列化
实体类:

```java
public class MyBean {
    public int id;
    private String name;
 
    @JsonProperty("name")
    public void setTheName(String name) {
        this.name = name;
    }
 
    @JsonProperty("name")
    public String getTheName() {
        return name;
    }
}
```

序列化和反序列化过程:

```java
public void whenUsingJsonProperty_thenCorrect()  throws IOException {
    MyBean bean = new MyBean(1, "My bean");
    String result = new ObjectMapper().writeValueAsString(bean);     
    assertThat(result, containsString("My bean"));
    assertThat(result, containsString("1"));
 
    MyBean resultBean = new ObjectMapper().readerFor(MyBean.class).readValue(result);
    assertEquals("My bean", resultBean.getTheName());
}
```

#### 4.2 @JsonFormat

该注解指定序列化日期和时间时的格式
修改前面`1.7`的实体类:

```java
public class Event {
    public String name;
 
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss")
    public Date eventDate;
}

```

序列化过程:

```java
public void whenSerializingUsingJsonFormat_thenCorrect() throws JsonProcessingException, ParseException {
    SimpleDateFormat df = new SimpleDateFormat("dd-MM-yyyy hh:mm:ss");
    df.setTimeZone(TimeZone.getTimeZone("UTC"));
 
    String toParse = "20-12-2014 02:30:00";
    Date date = df.parse(toParse);
    Event event = new Event("party", date);     
    String result = new ObjectMapper().writeValueAsString(event);     
    assertThat(result, containsString(toParse));
}

```

#### 4.3 @JsonUnwrapped

该注解指定值在序列化和反序列化时, 去除对应属性的外包装(根节点)
实体类:

```java
public class UnwrappedUser {
    public int id;
 
    @JsonUnwrapped
    public Name name;
 
    public static class Name {
        public String firstName;
        public String lastName;
    }
}
```

序列化过程:

```java
public void whenSerializingUsingJsonUnwrapped_thenCorrect()  throws JsonProcessingException, ParseException {
    UnwrappedUser.Name name = new UnwrappedUser.Name("John", "Doe");
    UnwrappedUser user = new UnwrappedUser(1, name); 
    String result = new ObjectMapper().writeValueAsString(user);     
    assertThat(result, containsString("John"));
    assertThat(result, not(containsString("name")));
}
```

序列化结果:

```json
{
    "id":1,
    "firstName":"John",
    "lastName":"Doe"
}
```

#### 4.4 @JsonView

该注解指明属性序列化和反序列时的视图级别(View)
**视图类: 主要用于表明哪一级的实体类的属性会被序列化或反序列化**

```java
public class Views {
    public static class Public {}
    public static class Internal extends Public {}
}
```

实体类:

```java
class UserWithRoot {
    @JsonView(Views.Public.class)
    public int id;
    @JsonView(Views.Public.class)
    public String name;
    @JsonView(Views.Internal.class)
    public String school;
}
```

实例化过程:

```java
public void whenSerializingUsingJsonView_thenCorrect()
  throws JsonProcessingException {
    UserWithRoot user = new UserWithRoot();
    user.id = 1;
    user.name = "bl";
    user.school = "suide";
    try {
        System.out.println(new ObjectMapper().writerWithView(Views.Internal.class).writeValueAsString(user));
    } catch (JsonProcessingException e) {
        e.printStackTrace();
    }
}
```

本例中, school的视图级别是View.Internal类, 而序列化的映射器设定的视图显示级别是Views.Public类, 比school的类型高了一级, 所以序列化结果中没有school,

```json
{"id":1,"name":"bl"}
```

而如果修改映射器的视图级别是Views.Internal类, 则序列化结果中包含school

```json
{"id":1,"name":"bl","school":"suide"}
```

#### 4.5 @JsonManagedReference, @JsonBackReference

这两个注解配合使用, 可以解决两个不同类的属性的父子关系(parent/child relationships)和循环引用(work around loops)
使用@JsonBackReference可以在序列化时阻断循环引用, 原理是忽略被注解的属性, 否则会导致异常
本例中, 我们用这组注解来序列化ItemWithRef实体类:

```java
public class ItemWithRef {
    public int id;
    public String itemName;
 
    @JsonManagedReference
    public UserWithRef owner;
}
public class UserWithRef {
    public int id;
    public String name;
 
    @JsonBackReference
    public List<ItemWithRef> userItems;
}

```

序列化过程:

```java
public void whenSerializingUsingJacksonReferenceAnnotation_thenCorrect()  throws JsonProcessingException {
    UserWithRef user = new UserWithRef(1, "John");
    ItemWithRef item = new ItemWithRef(2, "book", user);
    user.addItem(item); 
    String result = new ObjectMapper().writeValueAsString(item); 
}

```

1. 序列化结果: {"id":2,"itemName":"book","owner":{"id":1,"name":"John"}}
2. 如果把注解对调并序列化user结果是: {"id":1,"name":"John","userItems":[{"id":2,"itemName":"book"}]}

#### 4.6 @JsonIdentityInfo

该注解标明在序列化和反序列化一个值时, 该属性是否作为对象的唯一标识
该特性可以有效的解除循环引用, 和@JsonBackReference的区别是循环引用的对象的一个属性, 可以作为该对象的唯一标识被序列化, 而@JsonBackReference的循环引用对象不会二次序列化
两个实体类:

```java
@JsonIdentityInfo(  generator = ObjectIdGenerators.PropertyGenerator.class,  property = "id")
public class ItemWithIdentity {
    public int id;
    public String itemName;
    public UserWithIdentity owner;
}

public class UserWithIdentity {
    public int id;
    public String name;
    public List<ItemWithIdentity> userItems;
}

```

实例化过程:

```java
public void whenSerializingUsingJsonIdentityInfo_thenCorrect()  throws JsonProcessingException {
    UserWithIdentity user = new UserWithIdentity(1, "John");
    ItemWithIdentity item = new ItemWithIdentity(2, "book", user);
    user.addItem(item); 
    String result = new ObjectMapper().writeValueAsString(item);
}
```

序列化结果:{"id":2,"itemName":"book","owner":{"id":1,"name":"John","userItems":[2]}}
这里循环引用对象是ItemWithIdentity, 当它作为UserWithIdentity的属性时, 指定它的id属性为其唯一标识序列化到UserWithIdentity当中

#### 4.7 @JsonFilter

该注解可以在序列化时指定一个过滤器
下面为一个实体类指定一个过滤器:

```java
@JsonFilter("myFilter")
public class BeanWithFilter {
    public int id;
    public String name;
}
```

定义过滤器并进行序列化

```java
public void whenSerializingUsingJsonFilter_thenCorrect()  throws JsonProcessingException {
    BeanWithFilter bean = new BeanWithFilter(1, "My bean"); 
    FilterProvider filters = new SimpleFilterProvider().addFilter("myFilter",    
     						SimpleBeanPropertyFilter.filterOutAllExcept("name")); 
    String result = new ObjectMapper().writer(filters).writeValueAsString(bean);
}
```

序列化结果:`{"name":"My bean"}`
**这里添加了一个`SimpleBeanPropertyFilter.filterOutAllExcept`过滤器, 该过滤器的含义是除`name`属性外, 其他属性都被过滤掉(不序列化)**

### 5 其他注解

#### 5.1 @JsonAppend

该注解用来给一个被序列化的对象添加一个虚拟属性. 这个功能非常有用, 尤其是当我们想直接在Json字符串中添加额外的信息时, 不再需要修改类的定义. 举例来说, 它可以很方便的在Json文档中插入bean的版本信息, 而不需要bean提供对应的属性.
使用@JsonAppend注解的实体类:

```java
@JsonAppend(attrs = {@JsonAppend.Attr(value = "version")})
public class BeanWithAppend {
    private int id;
    private String name;
    // constructor, getters and setters
}
```

序列化过程:

```java
BeanWithAppend bean = new BeanWithAppend(2, "Bean With Append Annotation");
ObjectWriter writer = mapper.writerFor(BeanWithAppend.class).withAttribute("version", "1.0");
String jsonString = writer.writeValueAsString(bean);
```

序列化结果: `{ "id": 2, "name": "Bean With Append Annotation", "version": "1.0" }`

#### 5.2 @JsonNaming

该注解用来在序列化时选择一个属性命名习惯来代替默认属性名. 注解参数value用来指定已有命名习惯, 或用户定义的命名习惯
除默认值(value=LOWER_CAMEL_CASE, 即驼峰命名法)外, Jackson库同时提供了4种内置的属性命名习惯:

- KEBAB_CASE: 属性名单词用短线分隔连接, 比如hello-world
- LOWER_CASE: 属性名用小写字母而且没有分隔符, 比如helloworld
- SNAKE_CASE: 属性名用小写字母而且用下划线做分隔符, 比如hello_world
- UPPER_CAMEL_CASE: 属性名所有单词用大写开头而且没有分隔符, 比如HelloWorld
- 下例中用SNAKE_CASE命名法, 将属性beanName名序列化为bean_name

```java
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class NamingBean {
    private int id;
    private String beanName;
    // constructor, getters and setters
}
```

序列化过程:

```java
NamingBean bean = new NamingBean(3, "Naming Bean");
String jsonString = mapper.writeValueAsString(bean);
```

序列化结果: { "id": 3, "bean_name": "Naming Bean" }

#### 5.3 @JsonPropertyDescription

Jackson的独立模块JSON Schema提供了创建Json信息表(Json schemas)来描述Java的类型信息. 信息表可用于输出我们期望的序列化Java对象, 或者在反序列化前验证Json文档(document)
注解@JsonPropertyDescription允许把人类可读的描述信息, 附加在要创建的Json信息表的description属性
实体类:

```java
public class PropertyDescriptionBean {
    private int id;
    @JsonPropertyDescription("This is a description of the name property")
    private String name;
    // getters and setters
}
```

序列化过程: 这里生成Json信息表的同时为它附加了`description`属性

```java
SchemaFactoryWrapper wrapper = new SchemaFactoryWrapper();
mapper.acceptJsonFormatVisitor(PropertyDescriptionBean.class, wrapper);
JsonSchema jsonSchema = wrapper.finalSchema();
String jsonString = mapper.writeValueAsString(jsonSchema);
```

序列化结果:

```json
{
    "type": "object",
    "id": "urn:jsonschema:com:baeldung:jackson:annotation:extra:PropertyDescriptionBean",
    "properties": 
    {
        "name": 
        {
            "type": "string",
            "description": "This is a description of the name property"
        },
 
        "id": 
        {
            "type": "integer"
        }
    }
}

```

#### 5.4 @JsonPOJOBuilder

该注解用来配置一个`builder`类用于定制反序列化过程, 尤其是当Json文档中属性命名习惯和POJO类对象的属性不同
准备反序列化的Json字符串: `{ "id": 5, "name": "POJO Builder Bean"}`
反序列化的目标类:

```java
@JsonDeserialize(builder = BeanBuilder.class)
public class POJOBuilderBean {
    private int identity;
    private String beanName;
    // constructor, getters and setters
}
```

注意:BeanBuilder是自定义bulider类, 参见下文.
可以看到, bean属性的名称和Json字符串中对应属性的名称不同. 这就是@JsonPOJOBuilder发挥作用的地方.
@JsonPOJOBuilder有两个参数:

- buildMethodName: 一个无参方法, 用来在绑定Json属性和bean属性后, 创建bean的实例
- withPrefix: 方法名前缀, 有该前缀的方法是用来匹配Json属性和bean的属性. 默认前缀是with
- 下面是BeanBuilder类定义:

```java
@JsonPOJOBuilder(buildMethodName = "createBean", withPrefix = "construct")
public class BeanBuilder {
    private int idValue;
    private String nameValue;
 
    public BeanBuilder constructId(int id) {
        idValue = id;
        return this;
    }
 
    public BeanBuilder constructName(String name) {
        nameValue = name;
        return this;
    }
 
    public POJOBuilderBean createBean() {
        return new POJOBuilderBean(idValue, nameValue);
    }
}
```

上面的代码中, 我们配置了注解`@JsonPOJOBuilder`的参数, 用`createBean`方法作为`build`方法, 用`construct`前缀来匹配属性名
反序列化过程:

```java
String jsonString = "{\"id\":5,\"name\":\"POJO Builder Bean\"}";
POJOBuilderBean bean = mapper.readValue(jsonString, POJOBuilderBean.class);
```

#### 5.5 @JsonTypeId

该注解作用于属性, 使得该属性不再是普通属性, 其值代表bean类的类型ID(`TypeId), 可以用它来描述多态时实体类对象的实际类型
实体类:

```java
public class TypeIdBean {
    private int id;
    @JsonTypeId
    private String name;
 
    // constructor, getters and setters
}
```

序列化过程:

```java
mapper.enableDefaultTyping(DefaultTyping.NON_FINAL);
TypeIdBean bean = new TypeIdBean(6, "Type Id Bean");
String jsonString = mapper.writeValueAsString(bean);
```

序列化结果:["Type Id Bean",{"id":6}]

- mapper.enableDefaultTyping(DefaultTyping.NON_FINAL)的作用是在序列化结果中显示实体类类型属性
- 结果是一个Json对象, 其中"Type Id Bean"是实体类ID的描述, {"id":6}是类的属性值

### 6 禁用Jackson注解

通过设置`MapperFeature.USE_ANNOTATIONS`可以禁用实体类上的Jackson注解
实体类:

```java
@JsonInclude(Include.NON_NULL)
@JsonPropertyOrder({ "name", "id" })
public class MyBean {
    public int id;
    public String name;
}
```

序列化过程:

```java
public void whenDisablingAllAnnotations_thenAllDisabled()  throws IOException {
    MyBean bean = new MyBean(1, null); 
    ObjectMapper mapper = new ObjectMapper();
    mapper.disable(MapperFeature.USE_ANNOTATIONS);
    String result = mapper.writeValueAsString(bean);
}
```

- 序列化结果:`{ "id":1, "name":null}`
- 如果注释掉`mapper.disable(MapperFeature.USE_ANNOTATIONS);`, 则序列化结果是: `{"id":1}`

