---
title: Java复习笔记
published: 2026-06-08
description: 大学java面向对象程序设计课程的复习笔记
image: ./covers/cover11.webp
tags: [复习笔记, Java, 软件开发]
category: 复习笔记
draft: false
---

# Java复习笔记

## 一、大题：

### 1.类之间的关系
```java
public class ClassA extends ClassB{...}  //继承
public class ClassA implements ClassB{...}  //接口
public abstract class TrafficTool{...} //抽象类
public abstract void slowDown(); //抽象类中抽象类的写法（后面重写）
```
### 2.常用写法
#### (1) Main函数
```java
public static void main(String[] args) //Main函数写法
```
#### (2) ArrayList和循环
```
for(ClassName i : ArrayListName)  //循环写法
ArrayList<ClassName> ArrayListName = new ArrayList<>(); //新建ArrayList
lists.add(new ClassA); // 加入到ArrayList中
```
#### (3) 输出
```
System.out.println(""); //输出
```
#### (4) 接口声明
```
public interface Vehicle {
    void speedUp();
    void slowDown();
} // 接口内直接声明，后续重写实现
```
#### (5) 数组相关
```
import java.util.Arrays;

public class Test {
    public static void main(String[] args) {
        int[] arr = {3,1,4,2};

        // 1. 打印数组（直接打印数组会输出地址，用Arrays才会输出内容）
        System.out.println(Arrays.toString(arr)); // [3, 1, 4, 2]

        // 2. 数组排序
        Arrays.sort(arr);
        System.out.println(Arrays.toString(arr)); // [1, 2, 3, 4]

        // 3. 数组查找
        int index = Arrays.binarySearch(arr, 3); // 找元素3的下标
        System.out.println(index); // 2

        // 4. 数组复制
        int[] newArr = Arrays.copyOf(arr, arr.length);
    }
} 
```
#### (6) 字符串相关
```
// 创建 String 对象
String str1 = "Hello Java";  // 直接赋值
String str2 = new String("Hello Java");  // 构造方法创建（新对象）

// 获取长度
int len = str1.length();  

// 按索引获取字符
char ch = str1.charAt(0);  // 获取索引0的字符：'H'

// 字符串拼接
String concatStr = str1.concat(" World");  // 拼接："Hello Java World"
String addStr = str1 + "!!!";  // 最常用拼接方式

// 分割字符串
String str = "a,b,c,d";
String[] splitArray = str.split(",");  // 按逗号分割，返回数组：["a","b","c","d"]

// 遍历字符串
for (int i = 0; i < str1.length(); i++) {
    System.out.println(str1.charAt(i));
}
```
#### (7) Vector相关
```java
Vector vector = new Vector(); //定义
vector.add("country China"); //增加内容

//遍历输出所有元素
Iterator it = vector.iterator();//使用迭代器
while(it.hasNext()){
    System.out.println(it.next());
}

//删除/查找
while(it.hasNext()){
    String str = (String) it.next();
    if(str.startsWith(prefix)){  //考过的 判断str是否以perfix为开头
        it.remove(); //安全删除
    }
}
```
#### (8) 文件读入
**重点：readline**
```java
//文件读入
import java.io.*;
public class ReadFile {
    public static void main(String[] args) {
        try {
            // 按题目提示：FileInputStream → InputStreamReader → BufferedReader
            FileInputStream fis = new FileInputStream("java.txt");
            InputStreamReader isr = new InputStreamReader(fis);
            BufferedReader br = new BufferedReader(isr);

            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
            br.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```
### 3.UML题目做题策略
- 1.根据题目找出有几个类，类里面分别有哪些变量，变量的属性应该是什么？
- 2.根据题目描述找出每个类之间的关系，继承、接口等（注意分析题目中暗示的继承关系）
- 3.判断每个类中有哪些东西是super，哪些是this，哪些可以直接复用

## 二、单选题知识点整理

### 1.Arraylist和vector
- ArrayList 继承了 AbstractList ，并实现了 List 接口
- Arraylist 线程不安全（Vector线程安全）
- ArrayList 存储的是对象引用，不能存基本数据类型
- ArrayList 是按照插入顺序的有序集合
- ArrayList 可以动态扩展，每次扩展到1.5倍

```java
ArrayList<T> a = new ArrayList<T>();  // T为Arraylist中元素类型
a.get(n) //来获取Arraylist中的第 `n+1` 个元素（index从0开始）
a.set(2, "Wiki"); // 第一个参数为索引位置，第二个为要修改的值
a.remove(3); // 删除第四个元素
a.size(); // 计算 ArrayList 中的元素数量
for(String i : a) // 迭代Arraylist中的元素
```
- Vector删除时必须用 `it.remove()` 而非 `vector.remove()`，否则会抛出 `ConcurrentModificationException`。

### 2.继承

- `a instanceof b` 只要左对象的实际类型是右类型 本身、子类、间接子类，结果为 true。
- `null instanceof` 任意类，结果永远是 `false`
- String类、基本类型类、System类、Math类、Collections类被 final 修饰，不能被继承。
- Java只支持单继承（一个类只能 `extends` 一个父类），但可以实现多个接口（implements 多个）
- 子类未必有更多成员（若没有新增成员则相同）

### 3.接口
`public ClassA implements InterfaceA`
- 接口不能被实例化，只能被实现
- 接口中的字段默认是 public static final（常量），不能定义普通成员变量，且接口常量必须在声明时直接赋值，且不能修改
- 接口中的方法没有方法体（接口无构造方法）
- 接口中抽象方法默认修饰符为 public abstract
- 接口可以多继承接口，类可以多实现接口。
- 接口不能有 private 方法
- 抽象类有构造方法（供子类 super() 调用）；接口无构造方法
- 抽象类=is-a（本质是什么）；接口=like-a（能做什么）

### 4.Srting类
- String 是不可变字符串
- String 是引用类型，不是基本数据类型
- `String s1 = "hello"; String s2 = "hello";` 则 `s1 == s2` 为 `true`
- String 类被 final 修饰，不能被继承

### 5.数组
- 数组的声明：
    `int[] arr;` `int arr[];`(定义引用，未分配内存)
    `int[][] matrix;`
- 数组的声明+初始化：
    `int[] arr = new int[3];` 
    `int[] arr = {1, 2, 3};` 
    `int[] arr = new int[]{1, 2, 3};`⭐
    `int[][] matrix = new int[3][3];`
    ```java
    // 直接赋值，编译器自动计算行列
    int[][] matrix = {{1, 2, 3},{4, 5, 6},{7, 8, 9}};
    ```
- 数组的初始化：
    ```java
    int[] arr; // 第一步：声明数组变量（无内存分配）
    arr = new int[10]; // 第二步：初始化（分配内存，指定长度）
    arr = new int[]{1,2,3}; // 或初始化并赋值
    ```
    
    
- 注意：Java 数组声明时 `int[]` 内不能写大小

### 6.关键字
- **`super` 关键字：**
    - `super` 代表父类对象引用，只存在于子类中，作用：访问父类的成员变量、成员方法、构造方法。
    - 同名变量、重写方法， `super.` 指向父类。

- **`this` 关键字：**
    - `this` 代表当前对象本身， `this()` 调用本类其他构造方法。
    - `this()` 可以在构造方法中调用本类的其他构造方法
    - `this` 既能在实例方法中使用，也能在构造方法中使用
    - 静态方法中没有 this

- `this()` 和 `super()` 都必须放在构造方法第一行，两者都禁止在 `static` 中使用。

- **`static` 关键字：**修饰类的成员（变量、方法、代码块、内部类），表示**属于类本身，而非对象实例** 不能被重写

- **`final` 关键字：** 不可修改、不可重写、不可继承
    - 可以先声明、后赋值，但仅允许赋值 1 次
    - 声明时不赋值不会报错，但使用前必须完成初始化。
    - `static final`属于类，类加载时就要完成赋值
- **`abstract` 关键字** 抽象、不完整，用来定义模板，强制子类补全实现。可修饰类、方法。
    - 只有方法声明，没有方法体（末尾分号结束）
    `public abstract void eat();`
    - 抽象方法必须写在抽象类 / 接口中
    - 子类继承抽象类后：必须重写所有抽象方法
    - `abstract` 修饰抽象类，不能使用 new 直接实例化
    - 普通子类继承抽象类 → 必须实现全部抽象方法
    - 抽象子类继承抽象类 → 可不用实现抽象方法，继续交由下一代子类实现
    - 包含抽象方法的类一定是抽象类

### 7.泛型
- 泛型可用于类、接口、方法
- 泛型在编译期进行类型检查，可用于增强类型安全
- 泛型类型参数只能是引用类型，不能使用基本类型
- 泛型在运行时不保留泛型信息，泛型只在编译时有效
- 泛型集合之间无继承多态关系
- `<U extends T>` 是上界通配符，意思是 `U` 必须是 `T` 本身或 `T` 的子类（上界为 `T`）。 对比：`<U super T>` 是下界通配符，`U` 必须是 `T` 或 `T` 的超类。

### 8.UML图绘制
- 类名-属性-方法
#### (1)访问权限符号
|符号|访问修饰符|含义|
|----|----------|-----|
|`+`|	`public`|公共，所有类可访问|
|`-`|	`private`|私有，仅本类访问|
|`#`|	`protected`|受保护，本类 + 子类 + 同包|
|`~`|	`default`|同包内可访问|

#### (2)语法格式
- 属性：`可见符 变量名 : 类型 [= 默认值]` 例如：`- name : String`
- 方法：`可见符 方法名(参数:类型) : 返回值类型` 例如：`+ setDir(dir:Direction) : void`

#### (3)绘图线条
- **箭头统一指向：被依赖 / 被继承 / 被实现的一方**
- 实线 + 空心三角：继承（泛化）  ——▷
- 虚线 + 空心三角：实现（接口）------▷
- 实线（可带箭头）：关联  ———
- 虚线 + 箭头：依赖  ------▶
- 实线 + 空心菱形：聚合  ——◇
- 实线 + 实心菱形：组合  ——◆
- 一个类关联箭头指回自身时，表示该类的对象可以持有同类对象的引用，称为 self-containing class（自包含类）

#### (4)用例图
- 描述参与者、功能（用例），多用于需求分析
- 参与者：小人图标，表示人 / 外部系统
- 用例：椭圆，代表系统功能
- 关系：实线连接

#### (5)时序图
- 对象之间按时间顺序的交互、方法调用流程
- 对象：顶部矩形，格式：`对象名 : 类名`
- 生命线：对象下方垂直虚线
- 激活框：虚线上的细长矩形（表示对象正在执行）
- 消息：水平箭头，表示方法调用，箭头指向被调用方

### 9.五大设计模式

- 单例模式
    - 一个类在整个程序中，有且仅有一个实例，并提供全局唯一访问入口。
    - 私有构造方法：禁止外部 `new`
    ```java
    //懒汉式
    public class Singleton {  
        private static Singleton instance;  
        private Singleton (){}  
        public static Singleton getInstance() {  
            if (instance == null) {  
                instance = new Singleton();  
            }  
            return instance;  
        }  
    }
    ```
    ```java
    //饿汉式
    public class Singleton {  
        private static Singleton instance = new Singleton();  
        private Singleton (){}  
        public static Singleton getInstance() {  
        return instance;  
        }  
    }
    ```
- 观察者模式
    - 一对多依赖：当被观察者状态改变时，自动通知所有观察者并触发更新
    - 核心角色
        - 被观察者：维护观察者列表，提供增删、通知方法
        - 具体主题：状态改变，触发通知
        - 抽象观察者：定义接收通知的更新接口
        - 具体观察者：收到通知后执行具体逻辑
    ```java
    //Subject.java
    public class Subject {
        private List<Observer> observers = new ArrayList<Observer>();
        private int state;
        public int getState(){
            return state;
        }
        public void setState(int state) {
            this.state = state;
            notifyAllObservers();
        }
        public void attach(Observer observer){
            observers.add(observer);      
        }
        public void notifyAllObservers(){
            for (Observer observer : observers) {
                observer.update();
            }
        }  
    }
    ```
    ```java
    // Observer.java
    public abstract class Observer {
        protected Subject subject;
        public abstract void update();
    }
    ```
    ```java
    // BinaryObserver.java 实体观察者类
    public class BinaryObserver extends Observer{
    
        public BinaryObserver(Subject subject){
            this.subject = subject;
            this.subject.attach(this);
        }
        
        @Override
        public void update() {
            System.out.println( "Binary String: " + Integer.toBinaryString( subject.getState() ) ); 
        }
    }
    ```
    每次主函数中`subject.setState();`时，`subject`自动调用`notifyAllObservers();`通知所有attach过的observer，让其更新状态

- 策略模式
    - 定义一系列算法，把每个算法封装成独立类，算法之间可自由切换
    - 使用到了重写，未使用重载
    - 核心是将算法的**定义**和**使用**分离
    - 核心角色
        - 抽象策略：接口 / 抽象类，定义算法统一规范
        - 具体策略：实现不同算法
        - 环境上下文：持有策略引用，对外提供调用入口
    ```java
    // Strategy.java
    public interface Strategy {
        public int doOperation(int num1, int num2);
    }

    // Operation1.java
    public class Operation1 implements Strategy{
        @Override
        public int doOperation(int num1, int num2) {
            return num1 + num2;
        }
    }

    // Context.java
    public class Context {
        private Strategy strategy;
        public Context(Strategy strategy){
            this.strategy = strategy;
        }
        public int executeStrategy(int num1, int num2){
            return strategy.doOperation(num1, num2);
        }
    }

    // MainClass.java
    public class MainClass {
        public static void main(String[] args) {
            Context context = new Context(new OperationAdd());
        }
    }
    ```

- 装饰器模式
    - 动态地给一个对象添加额外的职责，同时不改变其结构
    - 提供了一种灵活的替代继承方式来扩展功能
    - 核心角色
        - 抽象构件：顶层抽象接口/类，定义核心行为
        - 具体构件：原始基础对象（被装饰的主体）
        - 抽象装饰器：继承/实现抽象构件，持有抽象构件引用
        - 具体装饰器：在原有功能上叠加新逻辑
    ```java
    public interface Shape {
        void draw();
    }
    public class Rectangle implements Shape {
        @Override
        public void draw() {
            System.out.println("Shape: Rectangle");
        }
    }
    public class Circle implements Shape {
        @Override
        public void draw() {
            System.out.println("Shape: Circle");
        }
    }
    public abstract class ShapeDecorator implements Shape {
        protected Shape decoratedShape;        
        public ShapeDecorator(Shape decoratedShape){
            this.decoratedShape = decoratedShape;
        }
        public void draw(){
            decoratedShape.draw();
        }  
    }
    public class RedShapeDecorator extends ShapeDecorator {
        public RedShapeDecorator(Shape decoratedShape) {
            super(decoratedShape);     
        }
        @Override
        public void draw() {
            decoratedShape.draw();         
            setRedBorder(decoratedShape);
        }
        private void setRedBorder(Shape decoratedShape){
            System.out.println("Border Color: Red");
        }
    }
    public class DecoratorPatternDemo {
        public static void main(String[] args) {
            Shape circle = new Circle();
            ShapeDecorator redCircle = new RedShapeDecorator(new Circle());
            System.out.println("Circle with normal border");
            circle.draw();
            System.out.println("\nCircle of red border");
            redCircle.draw();
        }
    }
    ```

- 组合模式
    - 把单个对象和由多个对象组成的 “整体容器”，当成一模一样的东西来用
    - **单个节点、一组节点，调用方式完全一样**
    - 将对象组合成树形结构以表示"部分-整体"的层次结构，组合模式使得用户对单个对象和组合对象的使用具有一致性
    - 核心角色：
        - Component接口：定义了所有对象必须实现的操作
        - Leaf类：实现Component接口，代表树中的叶子节点
        - Composite类：也实现Component接口，并包含其他Component对象的集合
    ```java
    //抽象构件（统一接口）
    public abstract class FileNode {
        public abstract void show();
    }

    // 叶子节点（文件，无子节点）
    public class File extends FileNode {
        private String name;
        public File(String name) { this.name = name; }
        @Override
        public void show() {
            System.out.println("文件：" + name);
        }
    }

    // 容器节点（文件夹，可存子节点）
    import java.util.ArrayList;
    import java.util.List;
    public class Folder extends FileNode {
        private String name;
        private List<FileNode> childs = new ArrayList<>();
        public Folder(String name) { this.name = name; }

        // 添加子节点（文件/文件夹）⭐⭐⭐
        public void add(FileNode node) {
            childs.add(node);
        }

        @Override
        public void show() {
            System.out.println("文件夹：" + name);
            // 遍历所有子节点
            for (FileNode node : childs) {
                node.show();
            }
        }
    }
    ```


- **策略模式：换算法/换行为（做加法、减法、乘法，直接换一套逻辑）**
  **装饰器模式：在原有功能上叠加功能（原功能保留，外面多加东西）**

| 设计模式 | 核心作用 | 核心关系 (UML) | 一句话记忆 |
|---------|---------|---------------|-----------|
| 单例模式 | 全局唯一实例 | 独立类，静态成员 + 私有构造 | 一生只有一个对象 |
| 策略模式 | 算法自由切换，消灭 if/else | 实现 + 普通关联 | 一套接口，多种算法 |
| 观察者模式 | 一对多消息通知 | 双接口实现 + 关联 | 状态一变，全员收到通知 |
| 装饰模式 | 动态叠加功能，灵活扩展 | 实现 + 组合关联 + 继承 | 套壳加功能，不用子类泛滥 |
| 组合模式 | 树形结构，统一处理叶子 / 容器 | 实现 + 聚合（空心菱形） | 整体和部分一视同仁 |

### 10.Package包
- 包（package）用于组织类和接口，类似文件夹，提供命名空间
- 同一包内不能有同名类、不同包之间可以有同名类
- 包中的类可以是 default（包访问权限），不必须是 public
- 包不需要层层嵌套定义声明，包的目录结构层层对应，但声明时直接写全路径
  例如 `package com.student.util;`

### 11.重写和重载
**重载是「同一个类里方法同名不同参」，重写是「子类改写父类方法」**
- 重载（Overload）
    - 在同一个类中，多个方法方法名相同，但参数列表不同，彼此互为重载
    - 必要条件：①方法名完全一致；②参数（个数、类型或者顺序）必须不同
    - **注意：仅返回值不同，不能构成重载**
- 重写（Override）
    - 子类继承父类后，子类重新定义一个和父类签名完全一致的方法，覆盖父类原有实现
    - 必要条件：
        - 方法名和参数列表（个数、类型、顺序）完全相同
        - 返回值必须一模一样（子类返回值可以是父类返回值的子类（协变返回））
        - 子类方法权限不能比父类更严格
        - 子类抛出的受检异常，不能比父类更大/更多；可以：不抛异常、抛父类异常、抛父类异常的子类。
    - 注意：
        - `final`类型方法不能被重写
        - 父类的`private`方法子类看不见，本质不算重写
        - `static`静态方法不能被重写，只会 “隐藏”
        - `abstract`方法，普通子类必须重写
        - 构造方法不能重写，只能重载

### 12.异常
- Java中Exception和Error类都来自于Throwable类
- 非检查异常（Unchecked） = `RuntimeException` 及其子类，编译器不强制处理： `NullPointerException` `ArrayIndexOutOfBoundsException` `ClassCastException` 等。
- 检查异常（Checked）：`IOException` `SQLException` `ClassNotFoundException`，必须 try-catch 或 throws
- 运行时异常（UncheckedException）编译器不强制处理
- RuntimeException（非检查异常）不必显式捕获
- 同一异常对象可以被 catch 后再 throw，可以多次抛出
- 异常没有被处理，放在`callstack`（调用栈）中
- `try-catch-finally` 异常处理 
    ```java
    // 标准格式
    try {
        // 可能出现异常的代码（监控区）
        // 一旦代码出现异常，try 块内后续代码立即停止执行，直接跳转到匹配的 catch
        // try 不能单独存在，后面必须跟 catch 或 finally
    } catch (异常类型 异常对象) {
        // 捕获对应异常后的处理逻辑
        // 多个 catch 遵循：子类异常在前，父类异常在后
        // 只会执行第一个匹配到异常类型的 catch，其余 catch 不再执行
        
        // 常见打印报错用的语句：
        // e.getMessage(); 只打印异常原因文本，无类名、堆栈
        // e.toString(); 打印异常类名 + 异常原因
        // e.printStackTrace(); 输出异常类型、原因、代码报错行号、调用栈
    } finally {
        // 正常执行、出现异常、catch 中 return，finally 都会执行
        // 属于无论是否发生异常，**必定执行**的代码
        // 唯一不会执行 finally 的场景：
        // 执行 System.exit(0) 直接终止 JVM；
        // 程序所在线程被杀死、宕机等极端情况。
    }
    ```
    - 无异常：`try` → `finally`
    - 有异常，被 `catch` 捕获：`try`(中断) → `catch` → `finally`
    - 有异常，无对应 `catch`：`try`(中断) → `finally` → 异常向外抛出
    ```
    Throwable (父类)
    ├── Error (错误，不可处理)
    └── Exception (异常，可处理)
        ├── RuntimeException (运行时异常，非受检)
        └── UncheckedException (编译时异常，受检)
    ```

### 13.内部类
- 写在另一个类内部的类，外部包裹的类叫外部类
- 成员内部类：
    - 属于外部类的实例对象，依赖外部类实例
    - 成员内部类可以直接访问外部类的私有成员
    - 不能定义静态成员
    ```java
    // 方式1：外部类.内部类 引用 = 外部对象.new 内部类()
    Outer.Inner in = new Outer().new Inner();
    ```
- 静态内部类：
    - 用 `static` 修饰，属于外部类本身，不依赖外部类实例
    - 静态内部类不能访问外部类的非静态成员 
    - 可以正常定义静态变量、静态方法、实例成员
    ```java
    // 无需外部类实例
    Outer.StaticInner si = new Outer.StaticInner();
    ```
- 局部内部类
    - 定义在方法、代码块、构造器内部，作用域仅限当前局部
    - 局部内部类只能在定义它的方法内使用
    - 不能使用 `public/private/protected/static` 修饰
    - 可以访问外部类所有成员
    - 若访问所在方法的局部变量，该变量必须是 `final`
- 匿名内部类
    - 没有类名，一次性使用，简写代码
    - 本质：快速继承一个类 / 实现一个接口
    - 只能继承一个类或实现一个接口

### 14.构造方法
- **构造方法：类创建对象时，自动调用的特殊方法，作用是初始化对象成员**
- 构造方法只有`new`的时候才会调用，平时不使用
- 构造方法不能被继承，但子类可通过 `super()` 调用
- 构造方法没有返回值类型声明（void 也没有）
- 构造方法名必须与类名完全相同
- 一个类可以有多个构造方法（构造方法重载）
- `this()` 与 `super()` 调用构造
    - `this()` 调用本类中其他重载的构造方法
    - `super()` 调用父类的构造方法，子类构造默认第一行隐式存在 super()
    - 必须写在构造方法第一行
    - 同一构造中，`this()` 和 `super()` 只能二选一，不能共存
    - 不能循环调用
    - 父类没有无参构造时，子类必须手动写 `super(实参)` 指定调用父类有参构造
- 不能用 static、final、abstract、native 修饰构造方法
- 构造方法只存在重载、不存在重写
- 抽象类有构造方法、接口没有构造方法
- 核心用途：给新建的对象赋初始值，避免创建对象后再手动赋值

### 15.多态
- 同一个方法，不同对象执行不同实现；父类引用指向子类对象
- 多态可以通过继承或接口实现，然后重写父类方法
- 多态的优点：提高代码扩展性和可维护性

### 16.关联和聚合
- 关联(Association)
    - 表示两个类之间存在一种长期的、稳定的连接
    - 通常表现为一个类将另一个类作为成员变量
    - 两个对象的生命周期通常是独立的
- 聚合(Aggregation)
    - 关联的一种特殊形式，表示“整体与部分”的关系
    - 依然是成员变量，但在业务逻辑上强调“包含”关系，且该对象通常是从外部传入或共享的
    - 一个“部分”对象可以同时属于多个“整体”对象
    - 部分（Part）可以脱离整体（Whole）而独立存在，整体的销毁不一定导致部分的销毁
- 聚合是关联的特殊形式

### 17.静态模型和对象模型
- 静态模型 (Static Model)
    - 静态模型是对象模型中关于结构的那一部分
    - 它关注的是系统在不运行、不随时间变化时的组成成分及其相互关系
    - 不涉及“先做什么后做什么”，也不涉及状态的改变
- 对象模型 (Object Model)
    - 对象模型是对现实世界问题域或系统解决方案的全面抽象
    - 包含类的定义，还包含了对象之间的交互、状态变化以及系统的动态行为
    - 既包含静态结构（类图）
    - 也包含动态行为（序列图、状态图、活动图、协作图）

### 18.文件读写
- 文件写入：
    - PrintWriter
        - `print()`：输出内容不换行
        - `println()`：输出内容末尾自动换行
        - `printf()`：格式化输出
        - 必须调用 `close()` 关闭流释放资源
    - FileWriter：基础字符写入流，可写单个字符、字符串、字符数组，支持 `flush()` 刷新缓冲区、`close()` 关闭
    - BufferedWriter：缓冲字符写入流，效率更高，`newLine()` 实现跨平台换行
- 文件读入：
    - Scanner
        - `hasNext()`：判断是否还有数据
        - `next()/nextInt()/nextDouble()`：按分隔符读取数据
        - `nextLine()`：读取一整行
    - FileReader：基础字符读取流，`read()` 读单个字符，读到文件末尾返回 `-1`
    - BufferedReader
        - `readLine()`：读取一整行，文件末尾返回 `null`
- 多层包装：FileInputStream → InputStreamReader → BufferedReader（字节流转字符流 + 缓冲）
- 异常处理
    - 读文件：文件不存在 → 抛出 `FileNotFoundException`（受检异常，必须捕获 / 声明）
    - 写文件：文件不存在 → 自动创建，不报错
    - 所有流操作异常父类：`IOException`
- Reader读入字符 Stream读入字节
### 小知识点
- 类型转换
    - 自动转换（隐式）：小范围到大范围
    - 强制转换（显式）：大范围到小范围，需加 (类型) 强转符
- 浮点数字面量默认是 double 类型
    - 错误写法：`float x = 6.0;`
    - 正确写法：`float x = (float) 6.0;` 或 `float x = 6.0f;`
- 装箱 & 拆箱（包装类（`Wrapper Class`）是指将基本数据类型（`Primitive Type`）封装成对象的类）
    - 装箱：基本类型 → 对应的包装类
    - 拆箱：包装类 → 基本类型
- 实例变量：属于对象，对象创建后才分配内存  
  静态变量：被 static 修饰，属于类，所有对象共享，类加载时初始化
- `import` 中 `*` 的作用：导入该包下所有类 / 接口，简化代码，无需逐个导入类
- `JavaDoc`：专门用于生成程序帮助文档，一般用于类、方法、成员变量上方
    - JavaDoc的首句：概要描述
    - 标签：`@author` , `@version` , `@return` 对代码附加声明
- Java 标识符规则：只能由字母、数字、_ 、$ 组成，不能以数字开头，不能是关键字。
- 数组索引从 `0` 开始
- Java 独立运行的程序叫 `Application（应用程序）`，有 `main()` 方法作为入口。 `Applets` 运行在浏览器中（已废弃）， `Servlets` 运行在服务器端， `Midlets` 是 J2ME 移动程序
- Java类初始化顺序（加载及实例化顺序）：
    - `静态变量 → 静态代码块 → 构造代码块 → 构造方法`（同级按代码顺序）
    - 静态变量/静态代码块（类加载时，只执行一次）
    - 构造代码块（每次创建对象执行）
- Java中所有类的根类是**Object类**，所有类都隐式继承`Object`
- JVM = Java Virtual Machine（Java 虚拟机）。它负责将字节码（.class）翻译为机器码执行，是 Java "一次编写，到处运行"的基础。
- Stack trace（堆栈跟踪）是异常发生时打印的方法调用链，显示从哪个方法调用到哪个方法最终触发了异常，帮助定位错误位置。还可用于理解执行流程、排查性能问题
**栈轨迹是方法调用的序列，不是变量列表，也不是错误本身。**
- 集合（Collection）表示一个对象拥有多个其他对象，体现的是 `one-to-many`（一对多）关系
- 当 `System.exit()` 被调用或 JVM 崩溃时，`finally`块不执行
- `java.util.Calendar` 使用 单例模式，通过 `Calendar.getInstance()` 获取实例，构造方法是 `protected`，不允许直接 `new`。
`Runtime` 类（`Runtime.getRuntime()`）也是典型单例。
- Java 编译器自动隐式导入 `java.lang.*`，所以 `String、System、Math、Object` 等无需 `import`。`java.util` 需要手动 `import`
- 文件读写
    - 打开不存在的文件进行读取时，Java 会抛出 `FileNotFoundException`，这是 `IOException` 的子类，属于 `Checked Exception`，必须处理。
- `Object` 类的方法：`toString`、`equals`、`hashCode`、`getClass`、`clone`、`wait`、`notify`、`notifyAll`、`finalize`
- 静态方法：
    - 静态方法中没有 this（无当前对象）
    - 静态方法不能是 abstract（abstract 要求子类实现，静态方法不被重写）
    - 静态方法只能直接访问静态变量和静态方法
    - 静态方法属于类本身，通过 类名.方法名() 调用
- 抽象类和接口都可以有数据字段，只是接口中的数据字段默认为常量
- `equals(Object obj)`用来测试两个字符串是否相等
- `public static void main` 中修饰符的顺序可以改变
- `FlowLayout` 是 `Panel` 和 `Applet` 的默认布局管理器（从左到右，超出则换行）。`JFrame/Frame` 默认是 `BorderLayout`；`JPanel` 默认也是 `FlowLayout`
- `java.awt.*` 是 Java AWT 图形界面的基础包，含 Frame、Panel、Button、Label 等核心组件

## 三、易错题&难题
![](image-36.png)
![](image-37.png)

## 四、历年真题
[16-17年AB卷](2016_2017_AB_answers.html)

[17-18年AB卷](2017_2018_AB_answers.html)

[18-19年AB卷](2018_2019_AB_answers.html)

[19-20年B卷](2019_2020_B_answers.html)

[20-21年AB卷](2020_2021_AB_answers.html)

## 五、大题整理（源自真题）
**简单求和**
```java
//Write a program to find the sum of all integers from 1 to 100, and output the results.
public class SumDemo {
    public static void main(String[] args) {
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            sum += i;
        }
        System.out.println("Sum from 1 to 100 = " + sum);
    }
}

// Declare an array intArr, which include {1,2,3,4,5}, Please write a Java program to caculate the sum of the five elements, then output the result into console. 
int[] intArr = {1, 2, 3, 4, 5};
int sum = 0;
for (int v : intArr) sum += v;
System.out.println(sum);
```
**计算大写字母**
```java
// (Count uppercase letters) Write a program that prompts the user to enter a string and displays
the number of the uppercase letters in the string.
Scanner in = new Scanner(System.in);
String s = in.nextLine();
int count = 0;
for (int i = 0; i < s.length(); i++) {
    if (Character.isUpperCase(s.charAt(i))) count++;
}
System.out.println(count);
```
**数码频率**
```java
// Digit Frequency Counting: Counting the frequency of each digit occurrence in a single array by using “BufferedReader”
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
String line = br.readLine();
int[] freq = new int[10];
for (int i = 0; i < line.length(); i++) {
    char ch = line.charAt(i);
    if (Character.isDigit(ch)) freq[ch - '0']++;
}
for (int i = 0; i < freq.length; i++) {
    System.out.println(i + ": " + freq[i]);
}
```
**最大最小值**
```java
// Max/min of 10 integers
Scanner input = new Scanner(System.in);
int max = Integer.MIN_VALUE, min = Integer.MAX_VALUE;
for (int i = 0; i < 10; i++) {
    try {
        int v = input.nextInt();
        max = Math.max(max, v);
        min = Math.min(min, v);
    } catch (InputMismatchException ex) {
        throw new IllegalArgumentException("input is not an integer");
    }
}
System.out.println("Max=" + max);
System.out.println("Min=" + min);
```
**字符串遍历、打印、删除、去重**
```java
import java.util.Iterator;
import java.util.Vector;

public class MainClass {
    Vector vector = new Vector();
    public MainClass() {
        vector.add("country China");
        vector.add("country America");
        vector.add("country English");
        vector.add("name Mary");
        vector.add("name Linda");
        vector.add("name Mike");
        vector.add("name John");
    }
    // ① 遍历输出所有元素
    public void printElements() {
        Iterator it = vector.iterator();
        while (it.hasNext()) {
            System.out.println(it.next());
        }
    }
    // ② 删除以指定前缀开头的字符串（用 Iterator 避免 ConcurrentModificationException）
    public void deleteStartsWith(String prefix) {
        Iterator it = vector.iterator();
        while (it.hasNext()) {
            String str = (String) it.next();
            if (str.startsWith(prefix)) {
                it.remove();   // 安全删除
            }
        }
    }
    // ③ 打印以指定前缀开头的字符串
    public void printStartsWith(String prefix) {
        Iterator it = vector.iterator();
        while (it.hasNext()) {
            String str = (String) it.next();
            if (str.startsWith(prefix)) {
                System.out.println(str);
            }
        }
    }
}
```
**文件读入**
```java
//Write a class to read a given text file (java.txt) and output contents to console. Hint: BufferedReader, FileInputStream, InputStreamReader.
import java.io.*;
public class ReadFile {
    public static void main(String[] args) {
        try {
            // 按题目提示：FileInputStream → InputStreamReader → BufferedReader
            FileInputStream fis = new FileInputStream("java.txt");
            InputStreamReader isr = new InputStreamReader(fis);
            BufferedReader br = new BufferedReader(isr);

            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
            br.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```
**单例模式**
```java
// Complete the singleton pattern for StudentInfo (only one instance can be created). ① field ② constructor ③ getSingletonInstance(). (10 points)
public class StudentInfo {
    // ① 私有静态实例字段（延迟初始化）
    private static StudentInfo instance = null;
    private String name;
    private String ID;
    // ② 私有构造方法，防止外部 new
    private StudentInfo() {
        name = "";
        ID = "";
    }
    // ③ 公有静态工厂方法，第一次调用时创建实例
    static public StudentInfo getSingletonInstance() {
        if (instance == null) {
            instance = new StudentInfo();
        }
        return instance;
    }
    public String getName() { return name; }
    public String getID()   { return ID; }
}

// There is a class named ImgResource, please applying singleton pattern to it, write the java code and draw the UML class diagram. 
public class ImgResource {
    private static final ImgResource INSTANCE = new ImgResource();
    private ImgResource() {}
    public static ImgResource getInstance() { return INSTANCE; }
}
```
**UML图综合大题1**
```java
// UserDTO.java
public class UserDTO {
    private String userAccount;
    private String userPassword;

    public String getUserAccount()  { return userAccount; }
    public void   setUserAccount(String acc) { this.userAccount = acc; }
    public String getUserPassword() { return userPassword; }
    public void   setUserPassword(String pwd) { this.userPassword = pwd; }
}

// IUserDAO.java（接口）
public interface IUserDAO {
    boolean addUser(UserDTO user);
}

// OracleUserDAO.java（实现类）
public class OracleUserDAO implements IUserDAO {
    public boolean addUser(UserDTO user) {
        // Oracle specific implementation
        return true;
    }
}

// RegisterForm.java
public class RegisterForm {
    private IUserDAO userDAO;

    public RegisterForm(IUserDAO dao) {
        this.userDAO = dao;
    }

    public void register(String account, String password) {
        UserDTO dto = new UserDTO();
        dto.setUserAccount(account);
        dto.setUserPassword(password);
        userDAO.addUser(dto);
    }
}
```
**UML图综合大题2.1**
```java
// Use the UML class diagram (Person ← Student / Employee) to create Java classes. Person.display() prints name; Student.display() prints name+ID; Employee.display() prints name+salary; hasSameName(Person) compares names; isEqual(Student) uses hasSameName and also compares ID. 
// Person.java
public class Person {
    private String name;

    public Person() { this.name = ""; }
    public Person(String name) { this.name = name; }

    public void   setName(String name) { this.name = name; }
    public String getName() { return name; }

    public void display() {
        System.out.println("Name: " + name);
    }

    public boolean hasSameName(Person p) {
        return this.name.equals(p.getName());
    }
}

// Student.java
public class Student extends Person {
    private int studentID;

    public Student() { super(); }
    public Student(String name, int id) { super(name); this.studentID = id; }

    public void  setID(int id) { this.studentID = id; }
    public int   getID() { return studentID; }

    @Override
    public void display() {
        System.out.println("Name: " + getName() + ", ID: " + studentID);
    }

    public boolean isEqual(Student s) {
        return hasSameName(s) && this.studentID == s.getID();
    }
}

// Employee.java
public class Employee extends Person {
    private double salary;

    public Employee(String name, double salary) {
        super(name);
        this.salary = salary;
    }

    public void   setSalary(double salary) { this.salary = salary; }
    public double getSalary() { return salary; }

    @Override
    public void display() {
        System.out.println("Name: " + getName() + ", Salary: " + salary);
    }
}
```
**UML图综合大题2.2**
```java
import java.io.*;
import java.util.*;

public class MainProgram {

    public static void main(String[] args) throws IOException {
        List<Student>  students  = new ArrayList<>();
        List<Employee> employees = new ArrayList<>();

        // ─── (A) 读取 students.txt ───────────────────────────────────
        BufferedReader br = new BufferedReader(new FileReader("students.txt"));
        String line;
        while ((line = br.readLine()) != null) {
            String[] p = line.trim().split("\\s+");
            if (p.length >= 2)
                students.add(new Student(p[0], Integer.parseInt(p[1])));
        }
        br.close();

        // 读取 employees.txt
        br = new BufferedReader(new FileReader("employees.txt"));
        while ((line = br.readLine()) != null) {
            String[] p = line.trim().split("\\s+");
            if (p.length >= 2)
                employees.add(new Employee(p[0], Double.parseDouble(p[1])));
        }
        br.close();

        // ─── (B) 查找重复学生记录（name 和 ID 均相同）─────────────────
        System.out.println("=== Duplicate Students ===");
        boolean found = false;
        for (int i = 0; i < students.size(); i++) {
            for (int j = i + 1; j < students.size(); j++) {
                if (students.get(i).isEqual(students.get(j))) {
                    System.out.print("Duplicate: ");
                    students.get(i).display();
                    found = true;
                }
            }
        }
        if (!found) System.out.println("No exact duplicates found.");

        // ─── (C) 查找同名的学生和员工 ─────────────────────────────────
        System.out.println("\n=== Students & Employees with Same Name ===");
        for (Student  s : students) {
            for (Employee e : employees) {
                if (s.hasSameName(e)) {
                    System.out.println("Match found:");
                    s.display(); e.display();
                }
            }
        }
        // 预期输出: Shirley（学生 751）和 Shirley（员工 7500）同名

        // ─── (D) 薪资最高的 3 名员工 ──────────────────────────────────
        System.out.println("\n=== Top 3 Employees by Salary ===");
        employees.sort((a, b) -> Double.compare(b.getSalary(), a.getSalary()));
        for (int i = 0; i < Math.min(3, employees.size()); i++) {
            employees.get(i).display();
        }
        // 预期: Alex(15000), Steven(12800), Vivian(12300)
    }
}
```