---
title: Java复习笔记
published: 2026-04-16
description: 大学java面向对象程序设计课程的复习笔记
image: ./covers/cover11.webp
tags: [复习笔记, Java, 软件开发]
category: 复习笔记
draft: false
---

# Java复习笔记

## 零、简单输入输出
```java
//读入
Scanner in = new Scanner(System.in); //声明一个Scanner类型的in，从标准输入流（System.in）读取数据
int a = in.nextInt();  //使用nextInt()读取下一个int类型并存入a中
double b = in.nextDouble(); //使用nextDouble()读取下一个double类型并存入b中
String input = in.nextLine(); //使用nextLine()读取一整行并存入input中
String input = in.next(); //使用next()读取一个单词并存入input中
in.close(); //关闭scanner

//读出
System.out.println("打印一行文字并换行");
System.out.print("打印一行文字");
```

## 一、数组的实现
例子：`JPanel panel[] = new JPanel[8];`
- 这里声明了一个变量 `panel` , 其类型是 `JPanel[]`（即 `JPanel` 类型的数组）
- `new` 关键字开辟了一块连续的空间

**注意：此时不能直接调用panel[0]，因为`new JPanel[8]` 只是创建了“容器”，容器里的每个格子都是空的，`panel[0]` 还没有指向任何实际的 `JPanel` 对象。**

还需要 `panel[i] = new JPanel()` 来初始化


## 二、常见的类的用法 JFrame JPanel JButton JMenuBar JTabbedPane BorderLayout CardLayout GridLayout JList JPasswordField JCheckBox JToggleButton JRadioButton BasicArrowButton Border

## 三、接口
**接口不是类，而是对希望符合这个接口的类的一组需求**

## 四、继承

## 五、重写

## 六、enum

## 七、ArrayList

## 八、抽象类

## 九、final

## 十、重载

## 十一、初始化块

## 十二、构造函数

## 十三、泛型

## 十四、instanceof

## 十五、模式匹配

## 十六、Object超类

## 十七、hashCode

## 十八、装箱拆箱

## 十九、异常和断言

## 二十、LinkedList

## 二十一、迭代器

## 二十二、Lambda表达式
