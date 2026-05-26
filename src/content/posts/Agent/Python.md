---

title: python大模型
description: 🥧python学习之路开启
image: 'https://img.f3f3.top/img/2026/04/28/87ab7f6d31b8b767723c61db968f171c.webp'#文章封面页
tags:
  - python基础
category: Agent 
  #永久连接id
abbrlink: "0"
# 文章置顶
pinned: true #文章置顶
published: 2026-04-20 18:19:03
updated: 2026-04-28 10:43:03
---

## 知识库

## 初识python基础

```python
print("我是李义非")
m=input("请写下你的姓名")
a="helllo"
b="world"
print(a,b)
# f-string写法
print(f'你好{a} ,世界{m}')
# ● %s：字符串占位符，用于插入字符串
# ● %d：整数占位符，用于插入整数
# ● %f：浮点数占位符，用于插入浮点数

#数据类型
# 不可变类型：int、float、str、tuple、bytes、bool（更改时，其实是新建了一个新的，内存地址已发送改变）
# 可变类型：list、dict、set（修改时是修改里面的元素，不改变内存地址）
# str字符串 bool判断类型 list列表arr [] tuple元组不可改变的列表()
# dict字典键值对组成{"name":"张三","age":30} set集合{}
# 用于限定输入类型
level = ""  # 定义空字符串
#循环一
# range(3) 代表循环 3 次，你可以改成 1、5、10 都行
for i in range(3):
    #for i in range(start,end，步长间隔)
    # 每次循环输入一个数字
    f = int(input("请输入一个数字："))
    # 默认输入的是字符串
    # 判断是否等于10
    if f == 10:
        level = "你真棒"  # 这里统一 4 个空格缩进

 while count > 0:
            count = (count // 2) - 2
            day += 1
        print(day)
# 循环结束后输出结果
print(level)
#遍历字符串
s="我爱中国"
    for i in s:
        print(i)
# break终止循环 continue跳出当前循环,继续执行下一个循环

```

## list列表

### 创建并修改 元素

```python
list2 = ["五菱宏光","哈弗","小米汽车","欧拉",True]
# 修改列表元素   语法:列表名[索引] = 值
print(list2)
list2[2] = "天狗" 
print(list2)
```

### 遍历列表

```python
list3 = ["麻辣烫", "佛跳墙", "白切鸡", "云吞"]
# 第一种方式:
for i in list3:
     print(i)
# 第二种方式: 通过索引的方式访问元素
for i in range(len(list3)):
     print(list3[i])

# 第三种方式:enumrate() 同时遍历索引和元素
for index,value in enumerate(list3):
     print(index,value)

```

### 列表操作

#### 列表合并与重复

```python
# 合并列表: 通过 + 实现
list = [12,34,6,8,3.13]
list1 = ["荔枝","龙眼","桂圆","榴莲","芒果"]
# 通过 + 实现列表的合并 list + list1
list2 = list + list1
print(list2)

# 重复输出列表中的元素: 通过 * 实现
list = [1,2,3]
list1 = list * 4
print(list1)
```

#### 判断列表中的位置

```python
# 判断指定元素是否在列表中, 使用成员运算符检查    
#  in 和 not in   返回值是一个布尔类型  True和False
list1 = [12,34,4.12,"haha","lele","hehe"]
print(12 in list1)   # True

if "haha" in list1:
    print("字符串在列表中")
else:
    print("不在列表中")
```

#### 列表截取

```python
list2 = [13,45,2,35,7,9]
# 语法: 列表名[开始下标:结束下标]   特点: 前闭后开  包含开始下标的元素不包含结束下标的元素
print(list2[1,3])#左闭右开
```

### 列表的crud

#### 添加元素

```python
# append()   向列表的尾部追加元素
list1 = ["香妃", "妲己", "赵飞燕", "杨贵妃", "东施"]
list1.append("西施")
print(list1)

# extend 用于在列表末尾一次追加另一个列表中的多个元素
list1 = ["香妃","妲己","赵飞燕","杨贵妃","东施"]
list1.extend(["乾隆","商纣王","汉昭帝","唐玄宗"])
list1.extend("秦始皇")   # "秦"  "始"  "皇"
print(list1)

# insert()  在列表中指定的索引处前面插入元素,后面的其他的元素依次后延
list2 = ["秦始皇","汉武帝","曹操","刘备","孙权"]
list2.insert(1, "刘邦")
print(list2)
```

#### 删除元素

```python
list2 = ["秦始皇","汉武帝","曹操","刘备","孙权"]

# pop() 传输的参数是下标  不传参数的时候,默认移除最后一个元素,返回的是原列表
list2.pop()  # ["秦始皇","汉武帝","曹操","刘备"]
list2.pop(2)   # ['秦始皇', '汉武帝', '刘备', '孙权']
print(list2)

# remove()  传输的参数是指定移除的元素
list2.remove("刘备")
print(list2)

# clear() 清空列表
list2.clear()
print(list2)   # []
```

#### 获取元素

```python
list = [12,34,2,5.23,True,False,"hello"]
# print(len(list))   # len 获取列表的长度

# 获取列表中的最大值  max()
list1 = [12,3,4,32,98,14,3,78,3,34,3]
print(max(list1))
# 获取列表中的最大值  min()
print(min(list1))

# 获取指定元素的索引   index(元素名称)
print(list1.index(98))
```

#### 排序和反转

```python
list = [12,42,34,16,87]

# reverse 翻转列表元素   注意:在原列表的内部进行翻转,不会生成新列表
list.reverse()
print(list)

# sort()  对原列表元素进行排序  默认是升序   不会生成一个新的列表
# 升序
list.sort()

# 降序   在sort函数中传入reverse=True 实现降序
list.sort(reverse=True)
print(list)

# sorted()  对列表元素进行排序,默认是升序, 排序的结果会生成一个新列表
# 升序
list1 = sorted(list)
# 降序  传入reverse=True
list1 = sorted(list,reverse=True)
print(list1)
```

## 元组tuple

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识元组并区分列表</summary>


和列表相似，本质上是一种有序的集合

元组和列表的不同之处：

​	a.列表:[ ]     元组：( )

​	b.列表中的元素可以进行增加和删除操作，但是，元组中的元素不能修改

​        【元素：一旦被初始化，将不能发生改变】

</details>

### 创建元组

```python
# 1.创建空元组
tuple1 = ()
print(type(tuple1))  # <class 'tuple'>

# 2.创建带有元素的元组
tuple2 = (12,34,6,87)
print(tuple2)
print(type(tuple2))  # <class 'tuple'>

# 3.元组中的元素可以是各种类型
tuple3 = (12,34,4.12,"hello",True)
print(tuple3)

# 注意:创建的元组只有一个元素时, 会在元素的后面加上一个逗号 ,
tuple4 = (2)
print(tuple4)
print(type(tuple4))  # <class 'int'> 

tuple5 = (3,)
print(tuple5)
print(type(tuple5))  #<class 'tuple'>
```

### 元组元素的访问

```python
tuple1 = (14,32,35,7,87)
# 1.访问元组的元素,使用下标访问,下标默认从0开始
print(tuple1[1])
# print(tuple1[5])  #  tuple index out of range  索引越界

print(tuple1[-1])  # 87  访问元组的最后一个元素 下标是-1
print(tuple1[-3])  # 35

# 2. 元组的元素的值不能进行修改
# tuple1[2] = 99
# print(tuple1)  # 报错'tuple' object does not support item assignment
```

### 元组的操作

```python
# 1.合并元组  +
tuple1 = (12,34,56)
tuple2 = (3.12,56,"hello")
print(tuple1 + tuple2)

# 2.重复元组中的元素  *
tuple3 = (23,45,67)
print(tuple3 * 4)

# 3.判断指定元素是否在元组中 使用成员运算符  in 和 not in
print(56 in tuple2)
if "hello" in tuple2:
     print("终于找到你")
else:
     print("你在哪里呢!")

# 4.元组的截取(切片)
tuple4 = (12,3,5,7,98)
print(tuple4[1:4])   # (3, 5, 7)
print(tuple4[-1:])  # (98,)
print(tuple4[:2])   # (12, 3)
```

### 元组的功能

```python
#获取元组的长度
tuple4 = (12,3,5,7,98)
print(len(tuple4))  # 5
print(max(tuple4))  # 98
print(min(tuple4))  # 3
#其他类型转换为元组
list1 = [12,34,57,89]
print(type(list1))  # <class 'list'>
print(type(tuple(list1))) # <class 'tuple'>
#遍历元组
# 第一种方式: for-in
for i in tuple4:
     print(i)

# 第二种方式: 通过下标访问
for i in range(len(tuple4)):	
     print(tuple4[i])

# 第三种方式: enumrate() 返回索引和元素
for i,n in enumerate(tuple4):
     print(i,n)
        
```

## 字典

### 初识字典

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">元组和列表的缺点</summary>


列表和元组的使用缺点：当存储的数据要动态添加、删除的时候，我们一般使用列表，但是列表有时会遇到一些麻烦

解决方案：既能存储多个数据，还能在访问元素的很方便的定位到需要的元素，采用字典

</details>

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初始字典</summary>


语法： {键1: 值1, 键2: 值2, 键3: 值3, ..., 键n: 值n} 

说明：键值对: key-value

- 字典和列表类似，都可以用来存储多个数据

- 在列表中查找某个元素时，是根据下标进行的；字典中找某个元素时，是根据'名字'（就是冒号:前面的那个值，例如上面代码中的'name'、'id'、'sex'）

- 字典中的每个元素都由2部分组成，键:值。例如 'name':'班长' ,'name'为键，'班长'为值

- 键可以使用数字、布尔值、元组，字符串等不可变数据类型，但是一般习惯使用字符串，切记不能使用列表等可变数据类型

- 每个字典里的key都是唯一的，如果出现了多个相同的key,后面的value会覆盖之前的value

习惯使用场景：

- 列表更适合保存相似数据，比如多个商品、多个姓名、多个时间

- 字典更适合保存不同数据，比如一个商品的不同信息、一个人的不同信息

</details>

### 创建字典并访问

```python
# 1.定义空字典 {}
dict1 = {}
print(type(dict1))  # <class 'dict'>

# 2.定义非空字典
# 第一种定义字典的方式
dict2 = {"name":"小明","age":25,"sex":"男","love":"篮球"}  # 最常用
print(dict2)
print(type(dict2))
print(dict2["name"], dict2["love"]) 
# 访问字典 字典名[键名]键名唯一
# 第二种方式:通过get()方法获取
print(dict1.get('name'))
print(dict1.get('money'))  # None   访问字典中不存在的key时,返回None
print(dict1.get('money',10000))  # 访问字典中不存在的key时,若传递了第二个参数,则使用第二个参数的值
```

###  字典的操作

#### crud

```python
#增加元素size为键名
dict4["size"] = 6.8
print(dict4)
#删除元素
#列表pop()利用索引删，remove()指名道姓的删
#字典pop()删除键名,popitem删除最后一对键值对
# 第一种:pop() 删除指定的元素
dict4.pop("color")
print(dict4)
# 第二种:popitem()  随机返回并删除字典中的最后一对key和value
dict4.popitem()
print(dict4)

# clear() 清空字典
dict4.clear()
print(dict4)

```

#### 获取字典各组成部分信息

```python
#获取字典长度
print(len(dict1))

#获取字典的键
print(dic1.keys())
#获取字典的值
print(dict1.values())
#获取字典的键值对
print(dict1.items())
```

#### 遍历字典

```python
#### 遍历字典第一种方式: for in
for key in dict1:  # 遍历字典中所有的key
    print(key)
    
# 第二种方式:遍历 字典中所有的值
for v in dict1.values():
    print(v)
    
# 第三种方式: items  遍历字典中所有的key和value
for k,v in dict1.items():
    print(k,'----',v)
```

### 合并字典

```python
dict2 = {"name":"刘哥","money":"1999","age":23}
dict3 = {"sex":"男"}
dict2.update(dict3)
print(dict2)#{'name': '刘哥', 'money': '1999', 'age': 23, 'sex': '男'}
```

## 赋值深拷贝浅拷贝

```python
# 赋值: 其实就是对象的引用(别名)
list = [12,34,57,9]
list1 = list
list[1] = 78
print(list,list1) #[12, 78, 57, 9] [12, 78, 57, 9]

# 浅拷贝: 拷贝父对象,不会拷贝对象内部的子对象.浅拷贝一维列表的时候,前后两个列表是独立的.
import copy
a = [12,35,98,23]  # 一维列表
b = a.copy()
a[1] = 67  #[12, 67, 98, 23] [12, 35, 98, 23]
print(a,b)

# 浅拷贝在拷贝二维列表的时候,只能拷贝最外层列表,不能拷贝父对象中的子对象,当修改子对象中的值的时候,新拷贝的对象也会发生变化
c = [14,53,25,[31,89,26],42] # 二维列表
d = c.copy()
c[3][1] = 11  #[14, 53, 25, [31, 11, 26], 42]   [14, 53, 25, [31, 11, 26], 42]
print(c,d)

# 若要解决浅拷贝处理二维列表时的问题,需要使用深拷贝解决
e = [14,53,25,[31,89,26],42] # 二维列表
f = copy.deepcopy(e)  #[14, 53, 25, [31, 11, 26], 42] [14, 53, 25, [31, 89, 26], 42]
e[3][1] = 11                         #两个列表是独立的
print(e,f)
```

## str字符串

### 创建字符串

```python
# 字符串的定义：可以使用一对单引号或者双引号，也可以一对三个单引号或者一对三个双引号定义字符串。
# 创建字符串
str = "apple"
str1 = 'orange'
print(type(str), type(str1))

# \ 转义字符  作用:让一些符号失去原有的意义
str2 = "\"张三\""
str3 = '\'李四\''
print(str2, str3)

# 定义字符串的时候,单双引号可以互相嵌套
str4 = "张哥,'有点厉害'"
print(str4)

# 字符串前加 r
# r"" 的作用是去除转义字符.
# 即如果是“\n”那么表示一个反斜杠字符，一个字母n，而不是表示换行了。
# 以r开头的字符，常用于正则表达式，对应着re模块。
s = r'C:\Users\ijeff\Desktop\笔记'
```

### 遍历字符串

```python
# 第一种方式: for in
for i in str4:
    print(i) 

# 第二种方式: 通过下标
for i in range(len(str4)):
    print(str4[i])

# 第三种方式:enumrate()
for i,v in enumerate(str4):
    print(i,v,end=" ")
```

### 字符串拼接重复

```python
#字符串拼接
str5 = "welcome to "
str6 = " china"
num = 19
print(str5 + str6)
# print(str5 + num)   # 注意,+ 只能用于字符串和字符串之间进行拼接

#字符串重复
print(str*5)
```

### 字符串截取和判定存在

```python
#字符串截取
ss1 = "good good study,day day up"
print(ss1[1:6])  # ood g
print(ss1[2:])   # od good study,day day up从下标2切到末尾
print(ss1[:9])   # good good从开头切到下标9
print(ss1[-1])   # p    省略 → 到末尾                     
print(ss1[1::2]) # odgo td,a a p   # 将步长设置为2
print(ss1[::-1])  # pu yad yad,yduts doog doog   # 将字符串实现翻转

#判断字符是否存在
#判断指定元素是否在字符串中  成员运算符 in 或者 not in
print("good" in ss1)
if "love" in ss1:
    print("终于找到了真爱")
else:
    print("继续寻觅吧!!")
```

### 常用功能

#### 获取长度和次数

```python
str4 = "张哥,'有点厉害'"
# 获取字符串的长度 len() 
print(len(str4))

# count() 在整个字符串中查找子字符串出现的次数
str = "电脑卡了,ss电脑呢?"
print(str.count("电脑"))   # 2
```

#### 大小写转换

```python
# 2.字符串大小写转换  upper() lower()
# upper()将字符串中的小写字母转换为大写
str1 = "i Miss you Very Much!"
print(str1.upper())  # I MISS YOU VERY MUCH!

# lower() 将字符串中的大写字母转化为小写
print(str1.lower())  # i miss you very much!

# swapcase   将字符串中的大写转换为小写,将小写转换为大写
print(str1.swapcase())  # I mISS YOU vERY mUCH!

# title()  将英文中每个单词的首字母转换为大写
str2 = "i love you forever!"
print(str2.title())  #   I Love You Forever!
```

#### 查找

```python
# find() 查找子串在字符串中第一次出现的位置, 返回的是下标,若未找到返回-1
ss3 = "123asdfASDCXaZ8765sahbzcd6a79"
print(ss3.find("a"))  # 3
print(ss3.find("y"))  # -1  未找到子串,返回-1
# 在指定区间内查找
print(ss3.find("a",5,20))  # 12

# rfind 查找子串在字符串中最后一次出现的位置,返回的是下标,若未找到返回-1
print(ss3.rfind("a"))  # 25
print(ss3.rfind("y"))  # -1

# index() 功能和find类似  在字符串中未找到的时候,直接报错 (了解)
print(ss3.index("d"))  # 5
# print(ss3.index("y"))  # ValueError: substring not found
```

#### 替换

```python
# 替换
# replace() 对字符串中的数据进行替换
ss9 = "国家主席习近平,习近平是一个伟人,我们感谢习近平主席"
print(ss9)
print(ss9.replace("习近平","***"))
# 控制替换的字符的次数
print(ss9.replace("习近平","***",2))
```

#### 判断(重点)

```python
# 字符串判断
# isupper() 检测字符串中的字母是否全部大写
print("ASDqwe123".isupper())  # False
print("ASD123".isupper())  # True

# islower() 检测字符串中的字母是否全部小写
print("ASDqwe123".islower())  # False
print("qwe123".islower())  # True

# isdigit() 检测字符串是否只由数字组成
print("1234".isdigit())  #True
print("1234asd".isdigit())  # False

#istitle()  检测字符串中的首字母是否大写
print("Hello World".istitle()) # True
print("hello everybody".istitle())  # False

# isalpha() 检测字符串是否只由字母和文字组成
print("你好everyone".isalpha())  # True
print("你好everyone123".isalpha())  # False
```

## 数学功能
