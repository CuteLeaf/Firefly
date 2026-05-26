---
title: java学习笔记下
description: 🥧java学习之路开启
image: 'https://img.f3f3.top/img/2026/05/10/47777df32b45be53db5473bd0fb17004.webp'
#文章封面页
tags:
  - java基础
category: JAVA学习 
  #永久连接id
abbrlink: "20"
# 文章置顶
pinned: true 
published: 2026-05-10 18:19:03
updated: 2026-05-13 10:43:03
---

## 异常

### 初识

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识</summary>


**异常（Exception）** 是指程序在运行过程中出现的错误情况，这些错误可能导致程序的正常流程中断。异常可以是由程序自身的逻辑错误引起，也可以是由外部因素（如文件未找到、网络中断等）导致。

</details>

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">层级结构</summary>


Error（错误）
描述：错误通常指的是由Java虚拟机（JVM）自身引起的严重问题，这些问题往往超出了程序的控制。错误通常无法通过程序代码来恢复，因此是不建议进行捕获和处理的（虽然它们可以写在 catch 后的括号中）。
示例：常见的错误有 OutOfMemoryError（内存不足）、StackOverflowError（栈溢出）和 NoClassDefFoundError（类定义未找到）。
处理建议：对于错误，通常不需要程序员处理，发生后程序很可能会直接终止。正确的做法是优化代码以避免这些错误的发生。

Exception（异常）
描述：异常是程序运行过程中可以被捕获并处理的问题。当程序遇到异常时，可以通过适当的处理机制（如 try-catch 块）来防止程序崩溃。
分类：
检查型异常（Checked Exceptions）：又名，编译时异常

描述：检查型异常是在编译时被检查的异常。程序员必须在代码中进行处理，否则编译器会报错。它们通常表示外部环境的问题，如文件未找到、网络连接失败等。
示例：IOException（输入输出异常）、SQLException（SQL异常）、ClassNotFoundException（类未找到异常）。
处理方式：使用 try-catch 块捕获异常，或在方法签名中使用 throws 声明该异常。
非检查型异常（Unchecked Exceptions）：又名，运行时异常

描述：非检查型异常是在运行时发生的异常，它们通常是由程序的逻辑错误引起的，如数组越界、空指针引用等。编译器不会强制要求程序员处理这些异常。
示例：NullPointerException（空指针异常）、ArrayIndexOutOfBoundsException（数组下标越界）、IllegalArgumentException（非法参数异常）。
处理方式：虽然不强制要求捕获，但建议在适当的地方进行处理，以提高程序的健壮性。

</details>

![](https://img.f3f3.top/img/2026/05/10/7038f9eb2a98fa94151565603f90bb53.webp)

### 运行时异常

![](https://img.f3f3.top/img/2026/05/10/b2719598cc1b0674553daeb4f2fa96bd.webp)

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">运行时异常</summary>


1.**NullPointerException 空指针异常**

当应用程序试图使用 `null` 作为对象的引用时，会抛出 `NullPointerException`。这通常发生在尝试访问对象的方法或属性时。

```java
public class Example {
	public static void main(String[] args) {
		String str = null;
		System.out.println(str.length()); // 尝试使用空引用
	}
}
```

**ArithmeticException 数学运算异常**

当发生算术运算的异常情况时，会抛出 `ArithmeticException`。最常见的情况是除以零。

```java
public class Example {
	public static void main(String[] args) {
		int result = 10 / 0;
	}
}
```

**ArrayIndexOutOfBoundsException 数组下标越界异常**

当尝试访问数组中不存在的索引时，会抛出 `ArrayIndexOutOfBoundsException`。该异常表示访问的索引超出了合法范围（0到数组长度-1）。

```java
public class Example {
	public static void main(String[] args) {
		int[] arr = new int[5];
		System.out.println(arr[-1]);
	}
}
```

**ClassCastException 类型转换异常**

当尝试将对象强制转换为不兼容的类型时，会抛出 `ClassCastException`。这通常发生在使用类型转换时。

```java
public class Example {
	public static void main(String[] args) {
		Object obj = new String();
		Integer num = (Integer)obj;
	}
}
```

**NumberFormatException 数字格式不正确异常**

当尝试将字符串转换为数字格式时，如果字符串的格式不符合数字的要求，就会抛出 `NumberFormatException`。例如，尝试将一个非数字字符串转换为整数。

```java
public class Example {
	public static void main(String[] args) {
		String str = "abc";
		int num = Integer.parseInt(str);
	}
}
```

</details>

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">编译时异常</summary>


1、SQLException
SQLException 是在与数据库交互时可能发生的异常。它可以指示由于数据库访问错误或其他数据库问题（如查询语法错误、连接失败等）而导致的错误。

2、IOException
IOException 是与输入/输出操作相关的异常，例如文件读取或网络通信时出错。它是处理文件和流操作时的常见异常。

3、FileNotFoundException
FileNotFoundException 是 IOException 的一个子类，在尝试打开一个不存在的文件时抛出。它通常在文件操作时进行检查。

4、ClassNotFoundException
ClassNotFoundException 是当应用程序尝试通过字符串名称加载类，但没有找到对应类时抛出的异常。这通常发生在使用反射或动态加载类时。

5、EOFException
EOFException 是在读取文件时遇到文件末尾（End of File）而未能成功读取数据时抛出的异常。通常在使用数据 [MySQL 8.0 Command Line Client.lnk](C:\Users\LYF\Desktop\MySQL 8.0 Command Line Client.lnk) 输入流（DataInputStream）时会遇到此异常。

</details>

### 捕获异常

#### try-catch 语句

```java
try {
    int result = 10 / 0; // 可能抛出 ArithmeticException
} catch (ArithmeticException e) {
    System.out.println("ArithmeticException: " + e.getMessage());
}
```

#### try-catch-finally语句

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">区别</summary>


`finally`块中的代码**无论是否发生异常，都会执行**，通常用于清理资源，如关闭文件或数据库连

对于 try-catch 语句和 try-catch-finally 语句是可以嵌套的

</details>

```java
BufferedReader reader = null;
try {
    reader = new BufferedReader(new FileReader("file.txt"));
    String line = reader.readLine();
    System.out.println(line);
} catch (IOException e) {
    System.out.println("IOException: " + e.getMessage());
} finally {
    // 确保资源被释放
    if (reader != null) {
        try {
            reader.close();
        } catch (IOException e) {
            System.out.println("Error closing reader: " + e.getMessage());
        }
    }
}
```

#### 一个catch块捕获多个异常

可以在一个`catch`块中捕获多个异常，使用管道符号**`|`**分隔多个异常类型。这对于处理多个异常类型时执行相同的处理逻辑非常有用。

```java
try {
    // 可能抛出异常的代码
} catch (IOException | NullPointerException e) {
    // 处理 IOException 或 NullPointerException
    System.out.println("Exception: " + e.getMessage());
}
```

#### try-with-resources

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识</summary>


**`try-with-resources`** 语句用于自动管理资源（如文件流、数据库连接等），确保在 `try` 块结束时自动关闭资源，避免资源泄漏。

</details>

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
 
public class TryWithResourcesExample {
    public static void main(String[] args) {
        try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
            String line = reader.readLine();
            System.out.println(line);
        } catch (IOException e) {
            System.out.println("IOException: " + e.getMessage());
        }
        // 无需显式关闭 reader，Java 会自动处理
    }
}
```

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">注意点</summary>


1.可能出现异常的语句要放到 try 块中

只有放到 try 语句块中的代码抛出的异常才能被 catch 语句块捕获到。

2.在 try 块中的某一句代码抛出异常后，该异常被 catch 捕获，则会直接跳入 catch 语句块中执行。try 块的剩余语句不会再执行了。

```java
public class Example {
	public static void main(String[] args) {
		try {
			int res = 1 / 0;
			System.out.println("..."); // 这一句不会执行
		} catch(ArithmeticException e) {
			System.out.println(e.getMessage());
		}
	}
}
```

3.没有发生异常或者没有捕获到异常，catch 块都不会被执行。

4.

```java
public class Example {
	public static int method() {
		try {
			String name = null;
			name.length();
		} catch (NullPointerException e) {
			return 1;
		} finally {
			return 2;
		}
	}
 
	public static void main(String[] args) {
		System.out.println(method());
	}
}
//由于 finally 块无论是否发生异常都会被执行，所以在 catch 块中不会返回，到了 finally 块中才会返回，所以最终 method() 方法返回值为 2
```

</details>

### 自定义异常

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识</summary>


自定义异常类通常需要继承 Exception 类（对于编译时异常）或 RuntimeException 类（对于运行时异常）。

可以根据需要为自定义异常类添加多个构造方法，以便于传递错误信息或其他相关信息

</details>

```java
class AgeOutOfRangeException extends RuntimeException {
	public AgeOutOfRangeException(String message) {
		super(message);
	}
 
	public AgeOutOfRangeException(String message, Throwable cause) {
		super(message, cause);
	}
}
```

#### 自定义异常的使用

```java
public class Example {
	public static void main(String[] args) {
		try {
			testAge(-1);
		} catch(AgeOutOfRangeException e) {
			System.out.println(e.getMessage());
		}
	}
 
	public static void testAge(int age)  {
		if(age < 0) {
			throw new AgeOutOfRangeException("年龄要大于或等于0岁");
		}
	}
}
 
class AgeOutOfRangeException extends RuntimeException {
	public AgeOutOfRangeException(String message) {
		super(message);
	}
 
	public AgeOutOfRangeException(String message, Throwable cause) {
		super(message, cause);
	}
}
```



### 抛出异常

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识throw</summary>


throw 是一个关键字，用于显式地抛出一个异常。它可以抛出任何类型的异常，包括自定义异常和Java内置异常。使用 throw 可以让开发者在特定条件下主动触发异常，从而能够进行异常的处理或传递。

</details>

#### 抛出内置异常

```java
public void checkNumber(int number) {
    if (number < 0) {
        throw new IllegalArgumentException("数字不能为负数");
    }
}
```

#### 抛出自定义异常

```java
class InvalidAgeException extends Exception {
    public InvalidAgeException(String message) {
        super(message);
    }
}
 
public class AgeValidator {
    public void validate(int age) throws InvalidAgeException {
        if (age < 18) {
            throw new InvalidAgeException("年龄必须大于或等于18岁");
        }
    }
}
```

#### throws抛出异常

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识throws异常</summary>


用于在方法声明中表明该方法可能会抛出哪些异常，由调用者处理。它告诉方法的调用者需要准备处理这些异常，或将它们传播给更高级别的异常处理代码。

一般用于某个方法中的语句可能抛出异常，但是并不能确定如何处理这个异常，则通过 throws 显式声明这个方法可能抛出的异常，表示这个方法将不对这个异常进行处理，调用者需要处理异常。

</details>

```java
public void myMethod() throws ExceptionType {
    // 可能抛出 ExceptionType 的代码
    // 这里的 ExceptionType 可以是可能抛出异常的类型，也可以是其父类类型
}
	

public static void foo() throws IOException, SQLException {
		// 可能抛出 IOException, SQLException 异常的语句
	}
```

##### 抛出编译时异常

throws 一般声明方法可能抛出编译时异常，这些异常必须在方法内部或调用者中进行处理。

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
 
public class ThrowsExample {
    
    public static void main(String[] args) {
        try {
            readFile("nonexistentfile.txt");
        } catch (IOException e) {
            System.out.println("文件未找到: " + e.getMessage());
        }
    }
 
    public static void readFile(String fileName) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(fileName));
        String line = reader.readLine();
        System.out.println(line);
        reader.close();
    }
}
```

### 异常处理

#### 编译时异常必须处理

对于编译时异常，必须在程序中处理，有两种方案，一种是捕获异常（使用 try-catch 语句），另一种是接着将异常抛到上级调用者（使用 throws 关键字）

![](https://img.f3f3.top/picgo/20260516134050397.webp)

#### 运行时异常

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">概述</summary>


对于运行时异常，如果程序中没有使用 try-catch 处理，默认就是使用 throws 的方案处理。所以说运行时异常出现可以不进行处理，实际上个是因为它有默认处理方式，而且一般使用默认处理方式。

这里在 foo() 方法中会出现 ArithmeticException 异常，这是一个运行时异常，显然我们在 foo() 方法中没有对这个异常进行处理（使用 try-catch 语句），所以它默认是使用 throws 方案处理的，这个异常被抛到 main 方法中，然后又被 main 方法抛到 JVM 中，最终由 JVM 将异常信息打印出来，然后结束程序。

</details>

```java
public class Example {
	public static void main(String[] args) {
		foo();
	}
 
	public static void foo() {
		int res = 1 / 0;
	}
}
```

#### 子类重写父类方法抛出异常的限制

子类重写父类的方法时，如果父类的这个方法会抛出异常，则子类重写的方法可以不抛出异常（也就是使用 try-catch 处理这个异常），或者抛出父类异常的一样类型的异常，或者抛出父类异常的子类异常。

```java
class SuperClass {
	public void foo() throws Exception {
		int res = 1 / 0;
	}
}
 
class SubClass1 extends SuperClass {
	@Override
	public void foo() { // 不抛出异常
		try{
			int res = 1 / 0;
		} catch(ArithmeticException e) {
			System.out.println(e.getMessage());
		}
	}
}
 
class SubClass2 extends SuperClass {
	@Override
	public void foo() throws Exception { // 抛出父类异常同类型异常
		int res = 1 / 0;
	}
}
 
class SubClass3 extends SuperClass {
	@Override
	public void foo() throws ArithmeticException { // 抛出父类方法抛出异常的子类异常
		int res = 1 / 0;
	}
}
```

## API

### String类

#### 初识

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识string类</summary>


1.String 类是一个 final 类，不能被继承。

2.String 类直接继承 Object 类，同时，String 类实现了 Serializable、Comparable、CharSequence 接口。

</details>

![](https://img.f3f3.top/picgo/20260516142817897.webp)

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">接口的用途</summary>


**实现 Serializable 接口用途**：

Serializable 接口是一个标记接口，表示实现该接口的类可以被序列化。序列化是**将对象的状态转换为字节流**的过程，以便于存储或传输。

对于 String 类来说，实现 Serializable 接口使得字符串对象可以被安全地保存到文件中，或通过网络传输。将字符串对象序列化后存储到文件中或者通过网络发送时，可以方便地恢复原始的字符串对象。

**实现 Comparable 接口用途：**

Comparable 接口定义了一个比较两个对象的顺序的标准。

实现这个接口允许字符串对象按照字典顺序进行比较，这在排序和搜索时非常有用。

使用 Collections.sort() 方法对字符串列表进行排序时，String 类中的 compareTo(String anotherString) 方法将被调用，以确定字符串的自然顺序。

**实现 CharSequence 接口用途**：

CharSequence 接口**允许 String 类提供对字符序列的访问。**

这个接口定义了一组可以用于处理字符序列的方法，如 length()、charAt(int index)、subSequence(int start, int end) 等。

实现这个接口使得String类能够与其他处理字符序列的类（如 StringBuilder、StringBuffer 等）兼容。可以将 String 对象直接传递给需要 CharSequence 类型参数的方法，比如 StringBuilder 的构造函数。

</details>

#### 构造器

##### string()

创建一个空字符串对象。

```java
String str = new String();
```

##### String(String original)

通过复制指定字符串的内容来创建一个新的字符串对象

```java
String str = new String("Hello");
```

##### String(char[] value)

通过字符数组创建字符串对象

```java
char[] chars = {'H', 'e', 'l', 'l', 'o'};
String str = new String(chars);
```

##### String(byte[] bytes, int offset, int length)

```java
byte[] bytes = {72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100};
String str = new String(bytes, 0, 5); // "Hello"
```

#### 字符串储存

String 对象的内容是存储在一个名为 value 的字符数组中，而且这个数组是使用 final 修饰的，意味着一旦被初始化，它的引用不能被改变（只是引用不能修改，value 的每一个元素是可以修改的）。这个设计决定了 String 对象的不可变性，以及其在内存中的表现。

```java
    private final char value[];
```

当创建一个 String 对象时，JVM 会为其分配内存，并在 value 数组中存储字符。value 数组会根据字符串的字符数动态大小化。字符串的每个字符会被存储为 char 类型，Java 使用 UTF-16 编码来表示字符，因此每个字符占用两个字节。

#### 不可变性

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">不可变性认识</summary>


由上面的 String 对象的内容是被存储在一个 final 字符数组 value 中的，我们可知，String 对象是不可变的（immutable）。

这意味着一旦创建了一个 String 对象，它的值就不能被改变。如果你对字符串进行任何修改操作，比如拼接、替换等，实际上会生成一个新的 String 对象。

上面说到 value 被 final 修饰只是 value 的引用不能修改，而 value 的每一个元素值可以修改。如果你想要对 String 对象的某个字母进行修改，可以使用 replace 方法，但是这个方法实际上还是会返回一个新的对象：

其实不直接修改源字符串的 value 的某个元素还有一个原因，因为 value 可能指向字符串常量池的某个字符串常量，字符串常量是没法被修改的。

</details>

```java
String original = "Hello";
String modified = original.replace('H', 'J');
// original 仍为 "Hello"
// modified 为 "Jello"
```

#### **字符串常量**

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">常量及池</summary>


**1.字符串常量是指在程序中直接使用的固定字符串值。**

```java
String str = "Hello, World!";
```

**2、字符串常量池**

字符串常量池（String Constant Pool）是用于存放字符串常量的特殊内存区域。这个池的主要作用是避免重复创建相同内容的字符串对象，从而节省内存。

```java
public class Example {
	public static void main(String[] args) {
		String str1 = "Hello";
		String str2 = "Hello";
 
		System.out.println(str1 == str2);
	}
}//ture str1 和 str2 指向的是同一个对象。
```

</details>

#### 字符串创建方式

只要使用了字符串常量，JVM 会先查找常量池中是否有相同的字符串常量，如果有，则什么也不做，如果没有的话，这个字符串常量会放到常量池。

##### 直接使用字符串常量赋值

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">认识</summary>


如果常量池没有相同的字符串常量的话，这个字符串常量会被放到常量池中，然后 String 引用变量会指向这个字符串常量。如果常量池中有相同的字符串常量，则 String 引用变量直接指向这个相同的字符串常量。 

</details>

![](https://img.f3f3.top/picgo/20260516151852609.webp)

##### 使用字符串常量加构造器创建

```java
	String str = new String("Hello");
```

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">认识</summary>


JVM 会先在常量池中找是否有 "Hello" 这个字符串常量

如果有的话，**在堆区创建一个 String 对象**，然后这个对象的 value 字段指向**常量池的 "Hello" 字符串常量**。
如果常量池没有 "Hello" 这个字符串常量的话，则会在常量池中创建一个 "Hello" 字符串常量，然后在堆区创建一个 String 对象，然后这个对象的 value 字段指向常量池的 "Hello" 字符串常量。
这里为什么要有找这个字符串常量的动作呢，因为这里使用构造器创建时使用了字符串常量，我们上面提到过使用字符串常量就会导致这一系列动作。

</details>

![](https://img.f3f3.top/picgo/20260516152855107.webp)

```java
	String str1 = "Hello";
	String str2 = new String("Hello");
```

![](https://img.f3f3.top/picgo/20260516153220649.webp)

##### 不使用或间接使用字符串常量创建

```java
	char[] chars = {'H', 'e', 'l', 'l', 'o'};
	String str = new String(chars);
```

这种方式会直接在堆区中创建 String 对象，然后 String 对象的 value 数组是从以上代码中的 chars 数组中复制得到的。

![](https://img.f3f3.top/picgo/20260516153614627.webp)

```java
	String str1 = new String("Hello");
	String str2 = new String("World");
	String str = str1 + str2;//方式二	堆对象	
// StringBuilder s = new StringBuilder;
		// s.append(str1);
		// s.append(str2);
		// str = s.toString();
最后 toString 方法会创建一个新的 String 对象，而且常量池中没有与这个 String 对象内容一样的 字符串常量。

```

##### intren方法

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">原理</summary>


当调用 intern() 方法时，JVM 会查看字符串常量池中是否有与当前字符串内容一样的字符串常量：

如果存在，则直接返回这个字符串常量的引用。
如果不存在，则将当前的 String 对象的引用放到常量池中，然后返回这个引用（这里只是将 当前的 String 对象的引用放到了常量池中，没有创建新的对象）。

JDK7 时将字符串常量从方法区移动到了堆区中。

</details>

```java
public class Example {
	public static void main(String[] args) {
		String str = new String("Hello");
		// 这里使用了字符串常量"Hello"，所以它会被放到常量池
 
		System.out.println(str == str.intern()); // false
		// 由于字符串常量池中有"Hello"常量，所以这里str.intern()返回的
		// 是常量池中的"Hello"常量的引用，而str指向的是堆区的字符串对象，
		// 所以这里的结果是false
	}
}
```

```java
public class Example {
	public static void main(String[] args) {
		String str1 = new String("Hello");
		String str2 = new String("World");
 
		String str = str1 + str2;
        // 这里是上面字符串创建方式提到的第三种创建方式
        // 间接使用构造器创建，所以这里的str指向的是一个堆区的
        // 字符串对象，而且常量池中没有与str内容一样的字符串常量
 
		System.out.println(str == str.intern()); // true
		// 这里由于str指向的是一个新的在堆区的String对象，内容为"HelloWorld"
		// 而在常量池中没有与"HelloWorld"内容一样的字符串常量，所以，str的引用会被放入到常量池中，然后被返回，所以这里str.intern()返回的还是str，所以
		// 这里会输出true
	}
}
```

```java
public class Example {
	public static void main(String[] args) {
		String a = "123"; 
		// a指向常量池的"123"
		String b = new String("123"); 
		// b指向堆区的String对象，
		// String对象的value指向常量池的"123"
 
		System.out.println(a.equals(b)); // true
		System.out.println(a == b); // false
		System.out.println(a == b.intern()); // true
        // 由于常量池中已经有了"123"常量，所以返回的是这个常量的引用，
        // 而a的引用就是这个常量的引用，所以这里结果为true
		System.out.println(b == b.intern()); // false
        // 这里b.intern()返回的是常量池中的"123"常量，对于b指向的则是堆区中的
        // 对象，所以这里是结果false
	}
}
```

#### String常用方法

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">String常用方法</summary>


equals(Object obj): 比较两个字符串的内容是否相同，返回布尔值。

equalsIgnoreCase(String anotherString): 比较两个字符串的内容是否相同，忽略大小写，返回布尔值。

length(): 返回字符串的长度，即字符的数量。

indexOf(String str): 返回指定子字符串在字符串中首次出现的位置，如果未找到则返回-1。

lastIndexOf(String str): 返回指定子字符串在字符串中最后一次出现的位置，如果未找到则返回-1。

substring(int beginIndex): 从指定的开始索引返回一个子字符串。

substring(int beginIndex, int endIndex): 返回从指定的开始索引到结束索引之间的子字符串（不包括结束索引）。

trim(): 返回去除字符串前后空格的新字符串。

charAt(int index): 返回指定索引处的字符。

toUpperCase(): 返回一个新的字符串，将原字符串中的所有字符转换为大写。

toLowerCase(): 返回一个新的字符串，将原字符串中的所有字符转换为小写。

concat(String str): 将指定字符串连接到原字符串的末尾，返回新的字符串。

compareTo(String anotherString): 按字典顺序比较两个字符串，返回一个整数，表示它们的相对顺序。

toCharArray(): 将字符串转换为一个字符数组。

format(String format, Object... args): 使用指定的格式字符串和参数生成格式化的字符串


</details>

### 八大包装类

#### 简要介绍

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识</summary>


包装类是用于将基本数据类型（如 int、char、boolean 等）包装成对象的类。每种基本数据类型都有对应的包装类，这些包装类提供了一种面向对象的方式来处理基本数据类型，允许它们被用于需要对象的场景，如集合框架、泛型等

</details>

![](https://img.f3f3.top/picgo/20260516155803307.webp)

#### 包装类的特点及用途

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">认识</summary>


包装类特点
封装性：所有的包装类都是 final 类，这意味着它们不能被继承。这种设计确保了包装类的行为和特性的一致性，从而避免了子类可能引入的不确定性。

不可变性：包装类的实例一旦被创建后，其中保存的基本数据类型数据就不能再被改变。这种不可变性使得包装类在多线程环境中更加安全，避免了因数据被意外修改而导致的错误。

提供方法：包装类封装了许多实用的方法，提供了丰富的功能。例如，它们支持数据类型转换、判断字符串的大小写、以及获取最大值和最小值等。

继承关系：除了 Character 和 Boolean 之外，其他所有的包装类都继承自 Number 类。这种继承关系使得这些包装类能够共享一些通用的功能和特性，例如数字的比较和转换，这为在不同数值类型之间的操作提供了一致的接口。


</details>

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">包装类的用途</summary>


对象操作：在Java中，许多集合类和框架方法需要对象作为参数，而不是基本数据类型。为了满足这一需求，包装类提供了将基本数据类型转换为对象的机制。通过使用包装类，我们可以轻松地在这些方法中传递基本数据类型。

Null值处理：基本数据类型无法为null，而包装类则可以。这一特性在某些情况下非常有用，例如在方法参数中，需要表示可选值或缺省值时。通过使用包装类，我们能够更灵活地处理这些场景，确保代码的健壮性和可读性。这种设计使得我们在处理数据时，可以更方便地进行null值检查，并在需要时安全地进行区分，从而提高了代码的灵活性。

</details>

#### 手动装箱和拆箱

装箱（Boxing）是将基本数据类型转换为相应的包装类的过程。拆箱（Unboxing）是将包装类转换为基本数据类型的过程。

**手动装箱就是使用一个值创建一个 Integer 对象**

```java
int num = 50000;
 
Integer boxedInt1 = new Integer(num); // 手动装箱方式一
 
Integer boxedInt2 = Integer.valueOf(num); // 手动装箱方式二
```

**手动拆箱就是使用 Integer 类型对象的 intValue() 方法来获取这个对象的 int 值**

```java
Integer boxedInt = new Integer(5);
int num = boxedInt.intValue(); // 手动拆箱
```

#### 自动装拆箱

```java
int num = 50000;
Integer boxedInt = num; // 自动装箱
Integer boxedInt = new Integer(50000);
int num = boxedInt; // 自动拆箱
```

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">底层</summary>


自动装箱的底层实现
自动装箱是通过调用包装类的valueOf()方法来实现的。

我们可以通过调试来验证这一结论，在要发生自动装箱的地方打上断点，然后直接跳到这个断点处，然后强制进入（force step into），就会进入到 valueOf() 方法中。

2）自动拆箱的底层实现
自动拆箱是通过调用包装类对象的xxxValue()方法来实现的。

我们可以通过调试来验证这一结论，在要发生自动拆箱的地方打上断点，然后直接跳到这个断点处，然后强制进入（force step into），就会进入到 xxxValue() 方法中。

</details>

#### 包装类的缓存机制

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初步认识</summary>
  

Java中的包装类缓存机制是为了优化性能和节省内存而设计的。

它为整型（Byte、Short、Integer、Long）、字符型（Character）和布尔型（Boolean）的包装类提供了缓存，确保在这些类型的小范围值之间可以复用对象。而对于浮点数类型的包装类（Float、Double），则没有这种缓存机制，意味着每次都需要创建新的对象。

这样一来，Java在处理常用值时更加高效，但在浮点数处理上则相对简单直接。

 </details>   

##### 缓存范围

对于 Integer 类，Java会缓存范围在 -128 到 127 之间的所有整数。

对于 Byte、Short 和 Character 类，缓存的范围也是类似的。具体范围如下：

Byte：-128 到 127
Short：-128 到 127
Character：0 到 127（即所有的ASCII字符）
Boolean：只有 true 和 false 两个值会被缓存

##### 触发缓存机制

只有调用 valueOf() 方法时，如果要创建的值已经被缓存，则会触发缓存机制。

我们可以查看 Integer 类的 valueOf() 方法的源代码

```java
    public static Integer valueOf(int i) {
        if (i >= IntegerCache.low && i <= IntegerCache.high)
            return IntegerCache.cache[i + (-IntegerCache.low)];
        return new Integer(i);
    }
//如果要创建的 Integer 对象的值在预定范围内，则返回缓存的对象，如果不在范围内，则直接新创建一个对象。
```

##### 测试缓存机制

我们可以通过使用 valueOf() 方法创建两个值一样且值在范围内的对象，然后比较它们的引用是否相等，如果相等，则能证明缓存机制的存在。

```java
public class Example {
	public static void main(String[] args) {
		Integer i1 = Integer.valueOf(1);
		Integer i2 = Integer.valueOf(1);
 
		System.out.println(i1 == i2);
	}
}                                                                                                                                                 
```

#### 包装类方法

##### 基本转换方法

1.parseInt(String s), parseDouble(String s), parseBoolean(String s) 等：将字符串转换为相应的基本类型。

2.valueOf(String s): 返回对应类型的包装类实例，例如 Integer.valueOf("123") 返回一个 Integer 对象。

##### 其他方法

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识</summary>


1**.获取基本类型值**

**intValue(), doubleValue(), charValue(), booleanValue() 等:** 返回包装类中封装的基本类型值。

2.**比较方法**

**compareTo(T another):** 用于比较两个包装类对象的大小。

**equals(Object obj):** 判断两个对象是否相等。

Integer.compare(x, y) 方法比较两个 Integer 对象的值。

3.类型检测

**isNaN(), isInfinite():** 用于 Double 和 Float 以检测是否为非数字或无穷大。

**isLetter(char ch)：**检查指定的字符是否为字母（包括大写和小写字母）。

**isDigit(char ch)**检查指定的字符是否为数字。

**isWhitespace(char ch)：**检查指定的字符是否为白空格字符（如空格、制表符等）

</details>

#### 包装类与字符串相互转换

```java
		Integer i = 10000;
		
		// 方式一
		String str1 = i + "";
		
		// 方式二
		String str2 = i.toString();
		
		// 方式三
		String str3 = String.valueOf(i);
//对于方法三，实际上内部也是调用 toString() 方法的。
```

```java
		String str = "10000";
 
		// 方式一
		Integer i1 = Integer.parseInt(str);
 
		// 方式二
		Integer i2 = Integer.valueOf(str);
		
		// 方式三
		Integer i3 = new Integer(str);
//这里看似通过字符串创建 Integer 类对象有三种方法，实际上就一种方法，对于方法二和方法三内部实际上都是调用 parseInt() 方法来将字符串转换为整型的。
```

### Math类

#### 常用方法

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识Math类</summary>


Math 类是一个工具类，提供了一系列用于数学运算的方法。该类中的方法都是静态的，因此可以直接通过类名调用，而不需要创建 Math 类的实例。Math 类主要用于基本的数学计算，如三角函数、对数、平方根等。

Math 类 位于 java.lang 包中，因此无需导入即可使用，它是一个 final 类，这意味着它不能被继承。

</details>

![](https://img.f3f3.top/picgo/20260517104854476.webp)

#### random方法使用公式

```java
//生成特定范围的随机浮点数
double min = 5.0; // 最小值
double max = 10.0; // 最大值
double randomValue = min + (Math.random() * (max - min));
//生成特定范围的随机整数
int min = 5; // 最小值
int max = 10; // 最大值
int randomInt = min + (int)(Math.random() * (max - min + 1));
//生成随机布尔值
boolean randomBoolean = Math.random() < 0.5;
//生成随机字符（例如：小写字母
char randomChar = (char)('a' + Math.random() * 26); 
//生成指定长度的随机字符串
StringBuilder randomString = new StringBuilder();
int length = 10; // 指定字符串长度
for (int i = 0; i < length; i++) {
    char randomChar = (char)('a' + Math.random() * 26); // 生成小写字母
    randomString.append(randomChar);
}
```

### System类

#### 常用方法

**1、arraycopy**

用于快速复制数组 。这比使用循环进行复制更高效

```java
import java.util.Arrays;
 
public class Example {
	public static void main(String[] args) {
		String[] arr1 = {"Hello", "World", "HelloWorld"};
 
		String[] arr2 = new String[3];
 
		System.arraycopy(arr1, 0, arr2, 0, arr1.length);
 
		System.out.println(Arrays.toString(arr2));
	}
}
```

```java
public class Example {
	public static void main(String[] args) {
		System.out.println("Hello");
		
		System.exit(1);
 
		System.out.println("World"); // 这一句将不会被输出
	}
}
```

```java
public class Example {
	public static void main(String[] args) {
		String s = new String();
 
		long startTime = System.currentTimeMillis();
 
		for(int i = 0; i < 10000; i++) {
			s += "Hello";
		}
 
		long endTime = System.currentTimeMillis();
		System.out.println("Execution time: " + (endTime - startTime) + " ms");
	}
}
```

### StringBuilder和StingBuffer类

#### StringBuffer



























### Arrays类

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">简要介绍</summary>


Arrays 类是 Java 语言中用于操作数组的一个工具类，提供了多种静态方法来处理数组，包括排序、搜索、填充、比较等操作。这个类位于 java.util 包中。

Arrays类的构造方法被设置为私有（private），因此无法创建 Arrays 对象。Arrays 类的所有公有方法都是静态的，可以直接通过类名调用

</details>

#### Arrays.toString()方法

##### 使用实例

```java
import java.util.Arrays;
 
public class Example {
	public static void main(String[] args) {
		int[] arr = {1, 2, 3, 4, 5, 6};
		System.out.println(Arrays.toString(arr));
	}
}
```

##### 源码分析

```java
    public static String toString(int[] a) {
        if (a == null) // 判断 a 是否为空引用，如果为空引用，则返回 "null" 字符串
            return "null";
        int iMax = a.length - 1;
        if (iMax == -1) // 判断数组内容是否为空，如果内容为空，则返回 "[]" 字符串
            return "[]";
 
        StringBuilder b = new StringBuilder();
        b.append('[');
        for (int i = 0; ; i++) {
            b.append(a[i]); // 依次将数组的元素追加到字符串中
            if (i == iMax) // 判断是否为最后一个元素，如果是最后一个元素，则返回最终的字符串
                return b.append(']').toString();
            b.append(", ");
        }
    }
```

#### Arrays.copyof()方法

```java
import java.util.Arrays;
 
public class Example {
	public static void main(String[] args) {
		// 原始数组
		int[] originalArray = {1, 2, 3, 4, 5};
 
		// 复制数组，指定新数组的长度
		// 新数组长度小于原数组长度
		int[] newArray1 = Arrays.copyOf(originalArray, 3);
		System.out.println("新数组1: " + Arrays.toString(newArray1)); // 输出: [1, 2, 3]
 
		// 新数组长度大于原数组长度
		int[] newArray2 = Arrays.copyOf(originalArray, 8);
		System.out.println("新数组2: " + Arrays.toString(newArray2)); // 输出: [1, 2, 3, 4, 5, 0, 0, 0]
 
		// 新数组长度等于原数组长度
		int[] newArray3 = Arrays.copyOf(originalArray, originalArray.length);
		System.out.println("新数组3: " + Arrays.toString(newArray3)); // 输出: [1, 2, 3, 4, 5]
	}
}
//第一个参数是源数组，第二个参数是从源数组中复制多少个元素到新数组中，如果第二个参数大于了源数组的大小，则新数组中大于源数组大小的部分的元素都是类型默认值。
```

#### Arrays.sort()方法

```java
import java.util.Arrays;
 
public class Example {
	public static void main(String[] args) {
		int[] arr = {11, 33, 99, 22, 88, 44, 55, 66, 77};
		Arrays.sort(arr);
		System.out.println(Arrays.toString(arr));
	}
}
```

##### 使用comparator接口

```java
import java.util.Arrays;
import java.util.Comparator;
 
public class Example {
	public static void main(String[] args) {
		Integer[] arr = {11, 33, 99, 22, 88, 44, 55, 66, 77};
        // 这里要使用 Integer 包装类        
 
		Arrays.sort(arr, new Comparator<Integer>() {
			@Override
			public int compare(Integer o1, Integer o2) {
				return o2 - o1;
			}
		});
		System.out.println(Arrays.toString(arr));
	}
}
```

这里的数组不能使用基本数据类型，因为这里的 sort() 方法的声明是这样的

```java
public static <T> void sort(T[] a, Comparator<? super T> c);
```

这里的 sort 是一个泛型方法，泛型参数只能接受类类型，所以这里需要使用包装类型数组作为第一个参数，对于第二个参数，我们传入的是

```java
    new Comparator<Integer>() {
		@Override
		public int compare(Integer o1, Integer o2) {
			return o2 - o1;
		}
	}
```

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">代码解释</summary>


这显然是一个匿名内部类，它实现了 Comparator 接口，同时重写了这个接口的 compare() 方法，这个方法是关键，这里返回值是 o2 - o1，这就代表了，如果 o1 如果大于 o2 的话，则返回负值，对于 sort() 方法内部某个地方就是调用的 compare() 方法来比较两个参数的大小。

如果是升序的话，o1 大于 o2 应当返回的是正值，这里返回了负值，所以就是将顺序设置为反的，所以最终可以得到降序的数组。

</details>

##### 使用的相关算法

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">简要分析</summary>


基本类型数组（如 int[], char[] 等）：

对于基本数据类型数组，Arrays.sort() 方法使用了一种名为 Dual-Pivot Quicksort 的排序算法。这是一种改进的快速排序算法，由 Vladimir Yaroslavskiy 提出。它在平均情况下具有 O(n log n) 的时间复杂度，并且在实践中通常表现良好。

对象类型数组（如 Integer[], String[] 等）：

对于对象数组，Arrays.sort() 方法则使用 Timsort 算法。这是一种混合排序算法，结合了归并排序和插入排序的优点。Timsort 是为了优化对部分有序数据的排序而设计的，具有 O(n log n) 的时间复杂度，并且在实际应用中表现出色。

</details>

#### Arrays.binarySearch()方法

```java
import java.util.Arrays;
 
public class Example {
	public static void main(String[] args) {
		int[] arr = {11, 22, 33, 44, 55, 66, 77, 88, 99};
 
		// Arrays.sort(arr)
		// 在调用 binarySearch 前需要对数组先进行排序
		// 这里为了方便比对结果，数组已经是有序的
		int index = Arrays.binarySearch(arr, 99);
 
		System.out.println("index of 99: " + index);
	}
}
```

#### Arrays.fill()方法

用指定的值填充数组，如果想要将一个数组的所有元素都是设置为某个值的话，可以使用这个方法。

```java
import java.util.Arrays;
 
public class Example {
	public static void main(String[] args) {
		int[] arr = new int[10];
		Arrays.fill(arr, 2333);
 
		System.out.println(Arrays.toString(arr));
	}
}
```

#### Arrays.equals方法

Arrays.equals() 方法用于比较两个一维数组是否相等。

```java
import java.util.Arrays;
 
public class Example {
	public static void main(String[] args) {
		int[] array1 = {1, 2, 3};
		int[] array2 = {1, 2, 3};
		int[] array3 = {1, 2, 4};
 
		// 比较相同的数组
		boolean isEqual1 = Arrays.equals(array1, array2);
		System.out.println("array1 和 array2 相等? " + isEqual1); // 输出: true
 
		// 比较不同的数组
		boolean isEqual2 = Arrays.equals(array1, array3);
		System.out.println("array1 和 array3 相等? " + isEqual2); // 输出: false
	}
}
```

#### Arrays.deepequals()方法

Arrays.deepEquals() 方法用于比较两个多维数组是否相等。它会递归地比较数组的每个元素。如果使用 Arrays.equals() 方法的话，则只会比较每一个低一维数组的引用是否相等。

```java
import java.util.Arrays;
 
public class Example {
	public static void main(String[] args) {
		int[][] array1 = {{1, 2, 3}, {4, 5, 6}};
		int[][] array2 = {{1, 2, 3}, {4, 5, 6}};
		int[][] array3 = {{1, 2, 3}, {4, 5, 7}};
 
		// 比较相同的二维数组
		boolean isEqual1 = Arrays.deepEquals(array1, array2);
		System.out.println("array1 和 array2 相等? " + isEqual1); // 输出: true
 
		// 比较不同的二维数组
		boolean isEqual2 = Arrays.deepEquals(array1, array3);
		System.out.println("array1 和 array3 相等? " + isEqual2); // 输出: false
	}
}
```

#### Arrays.asLIst()方法

Arrays.asList() 方法是 Java 中的一个静态方法，属于 java.util.Arrays 类。它可以将指定的数组转换为一个固定大小的列表（List）。这个方法返回一个 List 的视图，修改该列表会影响原始数组，反之亦然。

```java
import java.util.Arrays;
import java.util.List;
 
public class Example {
	public static void main(String[] args) {
		Integer[] numbersArray = {1, 2, 3, 4, 5};
 
		// 转换为列表
		List<Integer> numbersList = Arrays.asList(numbersArray);
 
		// 修改列表中的元素
		numbersList.set(0, 10);
 
		// 打印修改后的列表和数组
		System.out.println("修改后的列表: " + numbersList); // 输出: 修改后的列表: [10, 2, 3, 4, 5]
		System.out.println("修改后的数组: " + Arrays.toString(numbersArray)); // 输出: 修改后的数组: [10, 2, 3, 4, 5]
	}
}
```

##### 不能添加元素

```java
import java.util.Arrays;
import java.util.List;
 
public class Example {
	public static void main(String[] args) {
		String[] colorsArray = {"Red", "Green", "Blue"};
 
		// 转换为列表
		List<String> colorsList = Arrays.asList(colorsArray);
 
		// 尝试添加新元素（会抛出 UnsupportedOperationException）
		try {
			colorsList.add("Yellow");
		} catch (UnsupportedOperationException e) {
			System.out.println("无法添加元素到列表: " + e.getMessage());
		}
	}
}
//固定大小：返回的 List 的大小是固定的，因为原数组的大小是固定的。换句话说，您不能向该列表中添加或删除元素，因为这会导致列表的大小发生变化。当尝试调用 add() 或 remove() 方法来修改列表的大小时，会抛出 UnsupportedOperationException
```

## 集合框架

### 简要引入

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">简要引入</summary>


集合框架（Java Collections Framework）是一个用于存储和操作数据的架构，它提供了一组接口和类，用于处理不同类型的数据集合。集合框架的设计旨在提高代码的可重用性和灵活性。集合框架主要是从两个根接口：Collection 和 Map发散出来的。

我们知道数组创建之后大小就是固定的了，如果想要扩容还需要新建数组，然后将之前的数据复制到新数组中。使用集合框架，则可以解决这一问题。

</details>

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">collection单列集合</summary>


单列结构：`Collection` 接口及其子接口（如 `List、Set `和 `Queue`）主要用于存储单一类型的元素。每个集合只包含元素，不涉及键值对的概念。

1.List代表了有序**元素插入顺序 = 遍历顺序**可重复集合，可直接根据元素的索引来访问

2.Set代表无序不可重复集合，只能根据元素本身来访问

3.Queue是队列集合,用于按特定顺序处理元素

</details>

![](https://img.f3f3.top/picgo/20260517141916673.webp)

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">map双列集合</summary>


双列结构：Map 接口用于存储键值对（key-value pairs），其中每个键（key）都与一个值（value）相关联。每个键是唯一的，而值可以重复。常见实现包括：

HashMap：基于哈希表实现，允许快速查找，不保持元素的插入顺序。
TreeMap：基于红黑树实现，保持键的自然顺序或指定的顺序。
LinkedHashMap：保持元素的插入顺序

</details>

![](https://img.f3f3.top/picgo/20260517143022899.webp)

### Collection接口

#### List接口

##### ArrayList实现类

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识ArrayList</summary>


List 接口的核心特点是 有序（元素插入顺序 = 遍历顺序）、可重复，支持通过索引操作元素，适合需要按位置访问、频繁查询的场景。

（1）ArrayList：数组实现的 “动态数组”（最常用）
底层原理：基于数组实现，默认初始容量为 10，当元素个数超过容量时，会扩容为原来的 1.5 倍（oldCapacity + (oldCapacity >> 1)），扩容时会复制原数组元素到新数组；
核心特点：查询快（数组支持索引随机访问，时间复杂度 O (1)）、增删慢（需移动数组元素，时间复杂度 O (n)）；
适用场景：频繁查询、少量增删的场景（如商品列表展示、数据查询结果存储）

</details>

```java
import java.util.ArrayList;
import java.util.List;
 
public class ArrayListDemo {
    public static void main(String[] args) {
        // 1. 创建ArrayList（存储字符串）
        List<String> list = new ArrayList<>();
        
        // 2. 添加元素（有序、可重复）
        list.add("Java");
        list.add("Python");
        list.add("Java"); // 允许重复元素
        System.out.println("添加后：" + list); // 输出：[Java, Python, Java]
        
        // 3. 按索引访问元素
        String element = list.get(1);
        System.out.println("索引1的元素：" + element); // 输出：Python
        
        // 4. 按索引修改元素
        list.set(2, "C++");
        System.out.println("修改后：" + list); // 输出：[Java, Python, C++]
        
        // 5. 按索引删除元素
        list.remove(1);
        System.out.println("删除后：" + list); // 输出：[Java, C++]
        
        // 6. 遍历元素（三种方式）
        // 方式1：普通for循环（适合需要索引的场景）
        for (int i = 0; i < list.size(); i++) {
            System.out.print(list.get(i) + " ");
        }
        System.out.println();
        
        // 方式2：增强for循环（简洁）
        for (String s : list) {
            System.out.print(s + " ");
        }
        System.out.println();
        
        // 方式3：迭代器（支持遍历中删除元素）
        java.util.Iterator<String> iterator = list.iterator();
        while (iterator.hasNext()) {
            String s = iterator.next();
            if (s.equals("Java")) {
                iterator.remove(); // 安全删除，不会触发ConcurrentModificationException
            }
        }
        System.out.println("迭代器删除后：" + list); // 输出：[C++]
    }
}
```

##### LinkedList实现类

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识LinkedList实现类</summary>


LinkedList：双向链表实现的 “链表集合”
底层原理：基于双向链表实现，每个元素（节点）包含前驱节点、后继节点的引用，无需连续内存空间；
核心特点：查询慢（需遍历链表，时间复杂度 O (n)）、增删快（只需修改节点引用，时间复杂度 O (1)）；
适用场景：频繁增删、少量查询的场景（如队列、栈、消息队列）

</details>

```java
import java.util.LinkedList;
import java.util.List;
 
public class LinkedListDemo {
    public static void main(String[] args) {
        List<Integer> list = new LinkedList<>();
        
        // 添加元素
        list.add(10);
        list.add(20);
        list.add(30);
        System.out.println("添加后：" + list); // 输出：[10, 20, 30]
        
        // 在指定位置插入元素（增删效率高）
        list.add(1, 15);
        System.out.println("插入后：" + list); // 输出：[10, 15, 20, 30]
        
        // 删除指定元素
        list.remove(Integer.valueOf(20));
        System.out.println("删除后：" + list); // 输出：[10, 15, 30]
        
        // 链表特有的操作（作为队列/栈）
        LinkedList<Integer> linkedList = (LinkedList<Integer>) list;
        linkedList.addFirst(5); // 头部添加
        linkedList.addLast(35); // 尾部添加
        System.out.println("头部+尾部添加后：" + linkedList); // 输出：[5, 10, 15, 30, 35]
        
        int first = linkedList.getFirst(); // 获取头部元素
        int last = linkedList.getLast(); // 获取尾部元素
        System.out.println("头部：" + first + "，尾部：" + last); // 输出：头部：5，尾部：35
    }
}
```

![](https://img.f3f3.top/picgo/20260517144816290.webp)

#### set接口

##### HashSet实现类

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识HashSet</summary>


 Set 接口：无序、不可重复的 “集合”

Set 接口的核心特点是 **无序（元素插入顺序≠遍历顺序）、不可重复**（基于`equals()`和`hashCode()`判断），适合需要去重的场景。

HashSet：哈希表实现的去重集合（最常用）
底层原理：基于 HashMap 实现（HashSet 的元素作为 HashMap 的 key，value 为固定常量），利用哈希表保证元素唯一；
核心特点：无序、不可重复、查询和增删效率高（时间复杂度 O (1)）；
去重规则：先通过hashCode()计算哈希值，若哈希值不同则元素不同；

不同的元素hash值可能相同

若哈希值相同，再通过equals()判断是否相同，两者都相同则视为重复元素

</details>

```java
import java.util.HashSet;
import java.util.Set;
 
public class HashSetDemo {
    public static void main(String[] args) {
        Set<String> set = new HashSet<>();
        //接口多态编译左边实现右边
        
        // 添加元素（不可重复）
        set.add("Apple");
        set.add("Banana");
        set.add("Apple"); // 重复元素，添加失败
        System.out.println("添加后：" + set); // 输出：[Apple, Banana]（无序）
        
        // 删除元素
        set.remove("Banana");
        System.out.println("删除后：" + set); // 输出：[Apple]
        
        // 判断元素是否存在
        boolean contains = set.contains("Apple");
        System.out.println("是否包含Apple：" + contains); // 输出：true
        
        // 遍历元素（增强for/迭代器，无普通for循环，因为无序无索引）
        for (String s : set) {
            System.out.print(s + " "); // 输出：Apple
        }
        
        // 去重场景示例：数组去重
        String[] arr = {"Java", "Python", "Java", "C++"};
        Set<String> uniqueSet = new HashSet<>();
        for (String s : arr) {
            uniqueSet.add(s);
        }
        System.out.println("\n数组去重后：" + uniqueSet); // 输出：[Java, Python, C++]
    }
}
```

##### LinkedHashSet实现类

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">认识LinkedHashSet</summary>


LinkedHashSet：有序的去重集合

- **底层原理**：基于 HashMap + 双向链表实现，链表记录元素插入顺序，哈希表保证元素唯一；
- **核心特点**：有序（插入顺序 = 遍历顺序）、不可重复、效率略低于 HashSet；
- **适用场景**：需要去重且保持插入顺序的场景（如用户浏览记录去重）。

</details>

##### TreeSet实现类

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识TreeSet</summary>


- **底层原理**：基于红黑树实现，元素会按自然顺序（或自定义比较器）排序；
- **核心特点**：有序（排序后顺序）、不可重复、查询和增删效率 O (logn)；
- **适用场景**：需要去重且排序的场景（如成绩排名、数据按关键字排序）

</details>

```java
import java.util.TreeSet;
 
public class TreeSetDemo {
    public static void main(String[] args) {
        // 1. 自然排序（Integer按数值升序）
        TreeSet<Integer> numSet = new TreeSet<>();
        numSet.add(30);
        numSet.add(10);
        numSet.add(20);
        System.out.println("自然排序：" + numSet); // 输出：[10, 20, 30]
        
        // 2. 自定义排序（字符串按长度降序）
        TreeSet<String> strSet = new TreeSet<>((s1, s2) -> s2.length() - s1.length());
        strSet.add("Apple");
        strSet.add("Banana");
        strSet.add("Pear");
        System.out.println("自定义排序（长度降序）：" + strSet); // 输出：[Banana, Apple, Pear]
    }
}
```

#### Queue接口

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识对列</summary>


 Queue 接口：先进先出的 “队列”
Queue 接口遵循 先进先出（FIFO） 原则，元素从队列尾部添加，从头部删除，适合任务排队、消息传递等场景。

核心方法
offer(E e)：添加元素到队列尾部，失败返回 false（推荐使用，不抛出异常）；
poll()：删除并返回队列头部元素，队列为空返回 null；
peek()：返回队列头部元素，不删除，队列为空返回 null；
remove()：删除并返回队列头部元素，队列为空抛出异常。

</details>

```java
import java.util.LinkedList;
import java.util.Queue;
 
public class QueueDemo {
    public static void main(String[] args) {
        Queue<String> queue = new LinkedList<>();
        
        // 添加元素到队列
        queue.offer("任务1");
        queue.offer("任务2");
        queue.offer("任务3");
        System.out.println("队列初始化：" + queue); // 输出：[任务1, 任务2, 任务3]
        
        // 获取头部元素（不删除）
        String head = queue.peek();
        System.out.println("队列头部：" + head); // 输出：任务1
        
        // 删除并返回头部元素
        String task = queue.poll();
        System.out.println("执行任务：" + task); // 输出：执行任务：任务1
        System.out.println("执行后队列：" + queue); // 输出：[任务2, 任务3]
    }
}
```

### Map接口

#### HashMap实现类

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">认识HashMap</summary>


Map 接口存储 键值对（key-value），key 唯一（不可重复），value 可重复，每个 key 对应一个 value，适合通过 key 快速查找 value 的场景（如用户信息存储、配置项管理）。

1. HashMap：哈希表实现的键值对集合（最常用）
底层原理：JDK8 之前是 “数组 + 链表”，JDK8 之后是 “数组 + 链表 + 红黑树”；当链表长度超过阈值（8）且数组容量≥64 时，链表转为红黑树（提高查询效率）；当链表长度≤6 时，红黑树转回链表（节省内存）；
核心特点：无序、key 唯一、查询和增删效率高（O (1)）、线程不安全；
key 去重规则：同 HashSet，基于hashCode()和equals()判断。

</details>

```java
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
 
public class HashMapDemo {
    public static void main(String[] args) {
        // 1. 创建HashMap（存储用户ID-用户名）
        Map<Integer, String> userMap = new HashMap<>();
        
        // 2. 添加键值对（key唯一，重复key会覆盖value）
        userMap.put(1001, "张三");
        userMap.put(1002, "李四");
        userMap.put(1001, "张三三"); // 重复key，覆盖value
        System.out.println("添加后：" + userMap); // 输出：{1001=张三三, 1002=李四}
        
        // 3. 根据key获取value
        String username = userMap.get(1001);
        System.out.println("用户1001的名称：" + username); // 输出：张三三
        
        // 4. 判断key是否存在
        boolean hasKey = userMap.containsKey(1002);
        System.out.println("是否存在key=1002：" + hasKey); // 输出：true
        
        // 5. 删除键值对
        userMap.remove(1002);
        System.out.println("删除后：" + userMap); // 输出：{1001=张三三}
        
        // 6. 遍历HashMap（三种方式）
        // 方式1：遍历key集合
        Set<Integer> keySet = userMap.keySet();
        for (Integer key : keySet) {
            System.out.println("key：" + key + "，value：" + userMap.get(key));
        }
        
        // 方式2：遍历entrySet（推荐，效率高，避免多次get）
        Set<Map.Entry<Integer, String>> entrySet = userMap.entrySet();
        for (Map.Entry<Integer, String> entry : entrySet) {
            System.out.println("key：" + entry.getKey() + "，value：" + entry.getValue());
        }
        
        // 方式3：遍历value集合（无法获取key）
        for (String value : userMap.values()) {
            System.out.println("value：" + value);
        }
    }
}
```

#### LinkedMap实现类

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">认识LinkedMap</summary>


- **底层原理**：基于 HashMap + 双向链表实现，链表记录键值对的插入顺序或访问顺序；
- **核心特点**：有序（插入顺序或访问顺序）、key 唯一、效率略低于 HashMap；
- **适用场景**：需要保持键值对顺序的场景（如缓存 LRU 策略、历史操作记录）

</details>

```java
import java.util.LinkedHashMap;
import java.util.Map;
 
public class LinkedHashMapDemo {
    public static void main(String[] args) {
        // 1. 按插入顺序排序（默认）
        Map<String, Integer> insertOrderMap = new LinkedHashMap<>();
        insertOrderMap.put("Apple", 10);
        insertOrderMap.put("Banana", 20);
        insertOrderMap.put("Pear", 15);
        System.out.println("插入顺序：" + insertOrderMap); // 输出：{Apple=10, Banana=20, Pear=15}
        
        // 2. 按访问顺序排序（LRU策略）
        Map<String, Integer> accessOrderMap = new LinkedHashMap<>(16, 0.75f, true);
        accessOrderMap.put("Apple", 10);
        accessOrderMap.put("Banana", 20);
        accessOrderMap.put("Pear", 15);
        
        // 访问Banana和Apple
        accessOrderMap.get("Banana");
        accessOrderMap.get("Apple");
        System.out.println("访问顺序：" + accessOrderMap); // 输出：{Pear=15, Banana=20, Apple=10}
    }
}
```

#### TreeMap实现类

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">认识treeMap</summary>


- **底层原理**：基于红黑树实现，key 按自然顺序或自定义比较器排序；
- **核心特点**：有序（key 排序后顺序）、key 唯一、查询和增删效率 O (logn)；
- **适用场景**：需要按 key 排序的场景（如成绩排名表、字典序查询）

</details>

```java
import java.util.TreeMap;
 
public class TreeMapDemo {
    public static void main(String[] args) {
        // 1. 自然排序（Integer按数值升序）
        TreeMap<Integer, String> numMap = new TreeMap<>();
        numMap.put(3, "C");
        numMap.put(1, "A");
        numMap.put(2, "B");
        System.out.println("自然排序：" + numMap); // 输出：{1=A, 2=B, 3=C}
        
        // 2. 自定义排序（key按字符串长度降序）
        TreeMap<String, Integer> strMap = new TreeMap<>((s1, s2) -> s2.length() - s1.length());
        strMap.put("Apple", 10);
        strMap.put("Banana", 20);
        strMap.put("Pear", 15);
        System.out.println("自定义排序：" + strMap); // 输出：{Banana=20, Apple=10, Pear=15}
    }
}
```

#### ConCurrentHashMap实现类

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">认识ConCurrentHashMap</summary>


ConcurrentHashMap：线程安全的高效并发集合
底层原理：JDK8 之前是 “分段锁”，JDK8 之后是 “CAS+ synchronized”，只锁定链表 / 红黑树的节点，不锁定整个数组，并发效率高；
核心特点：线程安全、高效并发、key 唯一、无序；
适用场景：多线程环境下的键值对存储（如分布式系统中的共享配置、缓存）。

</details>

```java
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
 
public class ConcurrentHashMapDemo {
    public static void main(String[] args) throws InterruptedException {
        Map<Integer, Integer> map = new ConcurrentHashMap<>();
        
        // 多线程并发添加元素
        Runnable task = () -> {
            for (int i = 0; i < 1000; i++) {
                map.put(i, i);
            }
        };
        
        Thread t1 = new Thread(task);
        Thread t2 = new Thread(task);
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        
        System.out.println("最终元素个数：" + map.size()); // 输出：1000（无并发问题）
    }
}
```

![](https://img.f3f3.top/picgo/20260517153822918.webp)

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">避坑指南</summary>


1.ArrayList 遍历中删除元素：使用普通 for 循环删除会导致索引错位，推荐使用迭代器（Iterator.remove()）或增强 for 循环配合标记；
2.HashMap 的 key 必须重写 equals () 和 hashCode ()：自定义对象作为 key 时，需重写这两个方法，否则无法保证去重正确性；
3.HashSet/HashMap 无序性：不要依赖遍历顺序，若需有序请使用 LinkedHashSet/LinkedHashMap；
4.线程安全问题：ArrayList、HashMap、HashSet 等都是线程不安全的，多线程环境下需ConcurrentHashMap、CopyOnWriteArrayList 等线程安全集合，或手动加锁；
5.TreeSet/TreeMap 的 key 必须可比较：自定义对象作为 key 时，需实现 Comparable 接口或传入 Comparator，否则抛出 ClassCastException。

</details>

## Stream流

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识stream流</summary>


对集合（Collection）对象功能的增强，与Lambda表达式结合，可以提高编程效率、间接性和程序可读性。

**特点**

**1、代码简洁**：[函数式编程](https://so.csdn.net/so/search?q=函数式编程&spm=1001.2101.3001.7020)写出的代码简洁且意图明确，使用*stream*接口让你从此告别*for*循环

**2、多核友好**：Java函数式编程使得编写并行程序如此简单，就是调用一下方法

***流程***

1、将集合转换为Stream流（或者创建流）

2、操作Stream流（中间操作，终端操作）

stream流在管道中经过中间操作（intermediate operation）的处理，最后由最终操作(terminal operation)得到前面处理的结果

</details>

### 方法引用

### 函数式接口和Lambda表达式

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识函数式接口</summary>


只有唯一一个抽象方法的接口

- 可以有默认方法、静态方法

- 只能有1个 abstract 抽象方法

  1.作用

  专门给 Lambda 表达式用
  不是函数式接口 → 不能用Lambda简化

  2.内置常用4大函数式接口

  3.**Consumer 消费型**：有参无返回
  void accept(T t) 

  **Supplier 供给型**：无参有返回
  T get() 

  **Function 函数型**：有参有返回
  R apply(T t) 

  **Predicate 判断型**：有参返回布尔
  boolean test(T t) 

  4. 一句话记

  一抽象、可默认、标注解、配Lambda

  5.对比

  - 普通接口：多个抽象方法 → 只能匿名内部类

  - 函数式接口：一个抽象方法 → 优先Lambda

</details>

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识Lambda表达式</summary>


Lambda 是匿名内部类的简化写法，只用于函数式接口（有且仅有一个抽象方法）

```java
// 函数式接口
interface Run {
    void go();
}

// 匿名内部类
Run r = new Run() {
    @Override
    public void go() {
        System.out.println("跑起来");
    }
};

//lambda表达式写法
Run r = () -> System.out.println("跑起来");
```

- 无参： () -> 代码 

- 有参： (a,b) -> 代码 

- 单参可省略括号： a -> 代码 

- 多行代码用  {}

  匿名内部类：生成独立.class文件
  Lambda：不生成额外class，效率更高

  this 含义
  匿名内部类：指向内部类对象
  Lambda：指向外层类对象

 </details>

### 流创建操作

#### Stream创建

```java
List<String> list = new ArrayList<>();
Stream<String> stream = list.stream();  //串行流
Stream<String> parallelStream = list.parallelStream(); //并行流
 
Stream<Integer> stream1 = Stream.of(1,2,3,4,5);
```

#### Collection集合创建

```java
List<Integer> integerList = new ArrayList<>();
        integerList.add(1);
        integerList.add(2);
        integerList.add(3);
        integerList.add(4);
        integerList.add(5);
        Stream<Integer> listStream = integerList.stream();
```

#### Array数组创建

```java
int[] intArr = {1, 2, 3, 4, 5};
        IntStream arrayStream = Arrays.stream(intArr);
```

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">数值流与对象流转换</summary>


通过Arrays.stream方法生成流，并且该方法生成的流是数值流【即IntStream】而不是 Stream

注：****

使用数值流可以避免计算过程中拆箱装箱，提高性能。

Stream API提供了mapToInt、mapToDouble、mapToLong三种方式将对象流【即Stream 】转换成对应的数值流，同时提供了boxed方法将数值流转换为对象流

</details>

#### 文件创建

```java
try {
            Stream<String> fileStream = Files.lines(Paths.get("data.txt"), Charset.defaultCharset());
        } catch (IOException e) {
            e.printStackTrace();
        }
//通过Files.line方法得到一个流，并且得到的每个流是给定文件中的一行
```

#### 函数创建

##### iterator

```java
Stream<Integer> iterateStream = Stream.iterate(0, n -> n + 2).limit(5);
//iterate方法接受两个参数，第一个为初始化值，第二个为进行的函数操作，因为iterator生成的流为无限流，通过limit方法对流进行了截断 ，只生成5个偶数 
```

##### generator

```java
Stream<Double> generateStream = Stream.generate(Math::random).limit(5);
//generate方法接受一个参数，方法参数类型为Supplier ，由它为流提供值。generate生成的流也是无限流，因此通过limit对流进行了截断
```

##### Stream中的静态方法：of()、iterate()、generate()

```java
Stream<Integer> stream = Stream.of(1,2,3,4,5,6);
stream.forEach(System.out::println);  
// 输出：1 2 3 4 5 6
 
Stream<Integer> stream2 = Stream.iterate(0, (x) -> x + 2).limit(6);
stream2.forEach(System.out::println); 
// 输出：0 2 4 6 8 10
 
Stream<Double> stream3 = Stream.generate(Math::random).limit(2);
stream3.forEach(System.out::println); 
// 输出：两个随机数
```

##### BufferedReader.lines() 方法，将每行内容转成流

```java
 BufferedReader reader = new BufferedReader(new FileReader("F:\\test_stream.txt"));
Stream<String> lineStream = reader.lines();
lineStream.forEach(System.out::println);
```

##### **Pattern.splitAsStream() 方法，将字符串分隔成流** 

```java
Pattern pattern = Pattern.compile(",");
Stream<String> stringStream = pattern.splitAsStream("a,b,c,d");
stringStream.forEach(System.out::println);  
//输出：a b c d
```



### 操作符

#### 中间操作符

![](https://img.f3f3.top/picgo/20260521145926374.webp)

```java
    public static void main(String[] args) {
        List<User> userList = getUserList();
    }
 
    private static List<User> getUserList() {
        List<User> userList = new ArrayList<>();
 
        userList.add(new User(1,"张三",18,"上海"));
        userList.add(new User(2,"王五",16,"上海"));
        userList.add(new User(3,"李四",20,"上海"));
        userList.add(new User(4,"张雷",22,"北京"));
        userList.add(new User(5,"张超",15,"深圳"));
        userList.add(new User(6,"李雷",24,"北京"));
        userList.add(new User(7,"王爷",21,"上海"));
        userList.add(new User(8,"张三丰",18,"广州"));
        userList.add(new User(9,"赵六",16,"广州"));
        userList.add(new User(10,"赵无极",26,"深圳"));
 
        return userList;
    }
//泛型可承接javabean实体类
```

##### filter过滤

**用于通过设置的条件过滤出元素**

```java
//1、filter：输出ID大于6的user对象
List<User> filetrUserList = userList.stream().filter(user -> user.getId() > 6).collect(Collectors.toList());
filetrUserList.forEach(System.out::println);
```

**根据对象属性去重**

```java
//set集合元素不可重复
List<User> list = new ArrayList<User>() {{
	add(new User("Tony", 20, "12"));
	add(new User("Pepper", 20, "123"));
	add(new User("Tony", 22, "1234"));
	add(new User("Tony", 22, "12345"));
}};
 
//只通过名字去重
List<User> streamByNameList = list.stream().collect(Collectors.collectingAndThen(
		Collectors.toCollection(() -> new TreeSet<>(Comparator.comparing(User::getName))), ArrayList::new
));
System.out.println(streamByNameList);
//[User{name='Pepper', age=20, Phone='123'}, 
// User{name='Tony', age=20, Phone='12'}]
 
//通过名字和年龄去重
List<User> streamByNameAndAgeList = list.stream().collect(Collectors.collectingAndThen(
		Collectors.toCollection(() -> new TreeSet<>(Comparator.comparing(o -> o.getName() + o.getAge()))), ArrayList::new
));
System.out.println(streamByNameAndAgeList);
//[User{name='Pepper', age=20, Phone='123'},
// User{name='Tony', age=20, Phone='12'},
// User{name='Tony', age=22, Phone='1234'}]
//collectingAndThen 这个方法的意思是: 将收集的结果转换为另一种类型。

//因此上面的方法可以理解为：把 new TreeSet<>(Comparator.comparingLong(BookInfoVo::getRecordId))这个set转换为 ArrayLis
```

##### map:映射

**映射**

接受一个函数作为参数。这个函数会被应用到每个元素上，并将其映射成一个新的元素（使用映射一词，是因为它和转换类似，但其中的细微差别在于它是“创建一个新版本”而不是去“修改”）

```java
//2、map
List<String> mapUserList = userList.stream().map(user -> user.getName() + "用户").collect(Collectors.toList());
mapUserList.forEach(System.out::println);
//张三用户
//王五用户
//李四用户//张雷用户//张超用户//李雷用户//王爷用户//张三丰用户
```

**新值类型和原来的元素的类型相同示例**

```java
List<String> list = Arrays.asList("a,b,c", "1,2,3");
 
//将每个元素转成一个新的且不带逗号的元素
Stream<String> s1 = list.stream().map(s -> s.replaceAll(",", ""));
s1.forEach(System.out::println); 
// abc  123
 
Stream<String> s2 = list.stream().flatMap(s -> {
    //将每个元素转换成一个stream
    String[] split = s.split(",");
    Stream<String> s3 = Arrays.stream(split);
    return s3;
});
s2.forEach(System.out::println); 
// a b c 1 2 3
```

##### distinct：去重

返回一个元素各异（根据流所生成元素的hashCode和equals方法实现）的流

```java
//3、distinct：去重
List<String> distinctUsers =  userList.stream().map(User::getCity).distinct().collect(Collectors.toList());
distinctUsers.forEach(System.out::println);
```

##### sorted:排序

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">认识排序</summary>


自然排序（从小到大），流中元素需实现Comparable接口。 例：list.stream().sorted()

定制排序。常用以下几种：
list.stream().sorted(Comparator.reverseOrder()) //倒序排序（从大到小）
list.stream().sorted(Comparator.comparing(Student::getAge)) //顺序排序（从小到大）
list.stream().sorted(Comparator.comparing(Student::getAge).reversed()) // 倒序排序（从大到小）

</details>

**对象单字段排序**

```java
User u1 = new User("dd", 40);
User u2 = new User("bb", 20);
User u3 = new User("aa", 20);
User u4 = new User("aa", 30);
List<User> userList = Arrays.asList(u1, u2, u3, u4);
 
//按年龄升序
userList.stream().sorted(Comparator.comparing(User::getAge))
        .forEach(System.out::println);
 
//结果
User(name=bb, age=20)
User(name=aa, age=20)
User(name=aa, age=30)
User(name=dd, age=40)
```

**对象多字段、全部升序排序**

```java
//先按年龄升序，年龄相同则按姓名升序
User u1 = new User("dd", 40);
User u2 = new User("bb", 20);
User u3 = new User("aa", 20);
User u4 = new User("aa", 30);
List<User> userList = Arrays.asList(u1, u2, u3, u4);
 
// 写法1（推荐）
userList.stream().sorted(Comparator
                .comparing(User::getAge)
                .thenComparing(User::getName)
        // 可以写多个.thenComparing
).forEach(System.out::println);
 
System.out.println("------------------------------------");
 
// 写法2
userList.stream().sorted(
        (o1, o2) -> {
            String tmp1 = o1.getAge() + o1.getName();
            String tmp2 = o2.getAge() + o2.getName();
            return tmp1.compareTo(tmp2);
        }
).forEach(System.out::println);
 
System.out.println("------------------------------------");
 
// 写法3
userList.stream().sorted(
        (o1, o2) -> {
            if (!o1.getAge().equals(o2.getAge())) {
                return o1.getAge().compareTo(o2.getAge());
            } else {
                return o1.getName().compareTo(o2.getName());
            }
        }
).forEach(System.out::println);
 
//结果
User(name=aa, age=20)
User(name=bb, age=20)
User(name=aa, age=30)
User(name=dd, age=40)
```

**对象多字段、升序+降序**

```java
//先按年龄升序，年龄相同则按姓名降序
User u1 = new User("dd", 40);
User u2 = new User("bb", 20);
User u3 = new User("aa", 20);
User u4 = new User("aa", 30);
List<User> userList = Arrays.asList(u1, u2, u3, u4);
 
userList.stream().sorted(
        (o1, o2) -> {
            if (!o1.getAge().equals(o2.getAge())) {
                return o1.getAge().compareTo(o2.getAge());
            } else {
                return o2.getName().compareTo(o1.getName());
            }
        }
).forEach(System.out::println);
 
//结果
User(name=bb, age=20)
User(name=aa, age=20)
User(name=aa, age=30)
User(name=dd, age=40)
```

##### **limit**

```java
//5、limit：取前5条数据
userList.stream().limit(5).collect(Collectors.toList()).forEach(System.out::println);
```

##### **skip**

```java
//6、skip：跳过第几条取后几条
userList.stream().skip(7).collect(Collectors.toList()).forEach(System.out::println);
```

##### flatMap

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">flatmap与map的区别</summary>


使用flatMap方法的效果是，各个数组并不是分别映射成一个流，而是映射成流的内容。所有使用map(Arrays::stream)时生成的单个流都被合并起来，即扁平化为一个流

map：对流中每一个元素进行处理
flatMap：流扁平化，让你把一个流中的“每个值”都换成另一个流，然后把所有的流连接起来成为一个流 
本质区别：map是对一级元素进行操作，flatmap是对二级元素操作map返回一个值；flatmap返回一个流，多个值

应用场景：map对集合中每个元素加工,返回加工后结果；flatmap对集合中每个元素加工后，做扁平化处理后（拆分层级，放到同一层）然后返回

</details>

```java
//7、flatMap：数据拆分一对多映射
userList.stream().flatMap(user -> Arrays.stream(user.getCity().split(","))).forEach(System.out::println);
```

##### peek遍历

```java
//8、peek：对元素进行遍历处理，每个用户ID加1输出
userList.stream().peek(user -> user.setId(user.getId()+1)).forEach(System.out::println);
```

#### 终端操作符

##### collect

##### forEach

##### findFirst和findAny



















### Collect收集













## IO流

## 多线程

## 网络编程

## 反射

