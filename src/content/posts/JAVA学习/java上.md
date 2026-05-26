---

title: java学习笔记上
description: 🥧java学习之路开启
image: 'https://img.f3f3.top/picgo/650324.webp'#文章封面页
tags:
  - java基础
category: JAVA学习 
  #永久连接id
abbrlink: "201345"
# 文章置顶
pinned: false #文章置顶
published: 2022-08-09 18:19:03
updated: 2026-03-12 10:43:03
---



##  javase

- 命名规范![](https://img.f3f3.top/picgo/20260417131018489.png)

###  编写helloworld

```java
public class helloworld {
    public static void main(String[] args) {
        System.out.println(hello world);
    }
}

```

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">快捷键</summary>
psvm敲出程序主入口，sout敲出打印语句
</details>

### 初步认识

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">变量</summary>

变量的概念：
内存中的一个存储区域
该区域的数据可以在同一类型范围内不断变化
变量是程序中最基本的存储单元。包含变量类型、变量名和存储的值变量的作用：
用于在内存中保存数据使用变量注意：
Jaja中每个变量必须先声明，后使用使用变量名来访问这块区域的数据变量的作用域：其定义所在的一对{内变量只有在其作用域内才有效
同一个作用域内，不能定义重名的变量
</details>

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">变量的数据类型</summary>

基本数据类型：
整型：byte\short\int \lonl浮点型：float\double
字符型：char布尔型：boolean
引用数据类型：类（class）
接口（interface）数组(array)
</details>

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">运算符</summary>

&：并且，两边都为真，结果才是真System.out.println(true & true);
||:或者，两边都为假，结果才是假

^：相同为false，不同为true
！:取反
&&:并且，两边都为真，结果才是真:或者，两边都为假，结果才是假
</details>

```java
// 三元运算符示例代码
public class Tree {
public static void main(String[] args){
int num1 = 10;
int num2 = 20;
int max = num1 > num2 ? num1 : num2;
System.out.println(max);
System.out.println(num1 > num2 ? num1 : num2);
continue;
//结束本次循环,继续下次循环
//break;//结束整个循环
```

```java
//switch语句
public class Swich {
public static void main(String[] args) {
Scanner sc = new Scanner(System.in);
System.out.print("请输入您的选择:");
int choose = sc.nextInt();
switch (choose) {
case 1:
System.out.println("机票查询");
break;
case 2:
System.out.println("机票预订");
break;
case 3:
System.out.println("机票改签");
break;
case 4:
System.out.println("退出服务");
break;
default:
System.out.println("输入有误");
break;
```

Scanner输入包![](https://img.f3f3.top/picgo/20260417154033149.png)

```java
import java.util.Scanner;
public class test2 {
public static void main(String[] args) {
Scanner sc =new Scanner(System.in);
System.out.println("请输入一个整数");
int a =sc.nextInt();
System.out.println(a);
//Scanner后按回车自动生成import java.util.Scanner输入文字
    //放数据数据类型+变量名
    //修改 变量名=
}
```

## 循环

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">循环的认识</summary>


一,循环结构的4个要素
1.初始化条件
2.循环条件----boolean类型
3.循环体
4.迭代条件
二 for 循环 的结构
for(1;2;4){
3;
</details>

一些练习

```
//1到100累加
public class fori3 {
public static void main(String[] args) {
intsum=0;
for (int i = 1; i < 101; i++) {
if(i%2==0){
sum=sum+i;
J
System.out.println("1到100之间的偶数和为"+sum);
}
}
```

```java
//提取每一位
public class ShuiXian {
public static void main(String[] args) {
for(int i = 100;i<1000;i++){
inta=i%10;//个位
intb=i/10%10;//十位
intc=i/100;//百位
if(i == Math.pow(a,3)+Math.pow(b,3)+Math.pow(c,3)) 
System.out.println(i);
```

```
///逢七必过
public class for7{{
public static void main(String[] args) {
//逢7必过
for (int i = 1; i < 100; i++) {
if(i % 10 == 7 || i / 10 == 7
i % 7 == 0){
System.out.println("过");
continue;
System.out.println(i);
//break推出整个程序continue跳过这步进入下一步
//fori快捷生成循环语句，5.fori   i<5  ||或者  &&并且
```

```java
//while循环
public class Wile {
public static void main(String[] args) {
double paper=0.1;
int moutain=884430;
int count=0;
while(paper moutain){
paper=paper*2;
count++;
System.out.println("需要"+count+"天");
}
}
```

## 数组

### 特点

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">数组的特点</summary>


3.数组的特点:
1)数组是有序排列的
2)数组属于引用数据类型的变量。数组的元素,既可以是基本数据类型,也可以是引用数据类型
3)创建数组对象会在内存中开辟一整块连续的空间
4)数组的长度一旦确定,就不能修改。

</details>

静态初始化

```java
静态初始化
public class arrtest1 {
public static void main(String[] args) {
int[] arr = {11, 22, 33, 44, 55};
int num = arr[0];
System.out.println(num);
//sout打印
//0为索引
//修改数据
arr[0] = 33;
System.out.println(arr[0]);
}
```

### 数组遍历

```java
public class arrtest2 {
public static void main(String[] args) {
int[] arr = {11, 22, 33, 44, 55, 66, 77, 88, 999,1111,111111, 555, 666};
//arr.fori遍历数组
for (int i = 0; i < arr.length; i++) {
System.out.println(arr[i]);
}
//for增强循环iter快捷键
for (int i : arr){
System.out.println(i);
}
//遍历数组
//最大索引为长度减一
//.意味着调用
```

```
public class
arrtest3{
public static void main(String[] args) {
int[] arr={11,33,44};
int sum=0;
//arr.fori快速生成遍历数组
for (int i = 0; i < arr.length; i++) {
sum=arr[i]+sum;
}
System.out.println(sum);
儿数组遍历加累加求和
}
```

### 动态初始化

```java
public class arrtest5 {
public static void main(String[] args) {
//创建数组不知道要储放的数据
//int[] arr=new int[长度];第二种
//数组中有int默认值为0,double默认值为0.0由虚拟机给出默认值
int [] arr = new int[3];
//修改了数组中的默认值
arr[0]=10;
arr[1]=20;
arr[2]=30;
for (int i = 0; i < arr.length; i++) {
System.out.println(arr[i]);
```

```java
//未知数求和
import java.util.Scanner;
public class
arrtest6 {
public static void main(String[] args){/main方法名
int[]arr=new int[5];//不知道放什么
Scanner sc=new Scanner(System.in);
for (int i = 0; i < arr.length; i++) {
System.out.println("请输入数组中的数字");
int num=sc.nextInt();//每次输入
arr[i]=num;//把输入的数字放入数组中
}
intsum=0;//遍历求和
for (int i = 0; i < arr.length; i++) {sum=arr[i+sum;
}
System.out.println(sum);
```

### 获取数组中最大值

```java
public class max {public static void main(Strring[] args)
int[] arr = {11, 22, 33, 44, 55};
//获取数组中的最大值
//假设第一个元素是最大值
int max = arr[0];
for
(inti=0; i < arr.length; i++) {
if
(max < arr[i]) {
max = arr[i];
}
System.out.println(max);
```

### 转置数组

```java
public class
arrtest8 {
public static void main(String[] args) {
//动态初始化,指针双变量
int[]arr={1,2,3,4,5};
for(int i =0,j=arr.length-1;i<j;i++,j--)
{int temp=arr[i];
arr[i]=arr[j];
arr[j]=temp;
}
for
(int i=0; i <arr.length;i++){
System.out.print(arr[i]);
```

### 二维数组

```java
public static void main(String[] args) {
//int[][] arr = new int[3][4];//创建二维数组不知道内容
int[][] arr = {{1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10,11,12}};//知道内容
//获取6
System.out.println(arr[1][1]);
//遍历二维数组
for (int i = 0; i < arr.length; i++) {
for (intj=0;j<arr[i].length;j++){
System.out.print(arr[i][j]+" ");
//迭代器循环
    for (int[] ints:arr){
for (int anInt : ints){
System.out.println(anInt);
System.out.println();//换行嵌套在循环以内
}
}
//不知道二维数组的内容
//int [][]arr=new int[3][4];
//3为二维数组的行数,4为二维数组的列数
```

### 创建不重复的二维数组

```java
public class arr5 {
public static void main(String[] args) {
//创建一个6的int数组 元素在1-30 是随机赋值 而且元素值各不相同
int[] arr = new int[6];
for (int i = 0;i<arr.length;i++){
boolean count = true;
int value = (int)(Math.random()*29 + 1);
for (int j = 0;j<=i;j++) {
if(value==arr[j])//如果有和前面相同的就false 不打和
count = false;
i--;//这次没有加入数据 重新来
break;
if(count){
arr[i] = value;
for (int name : arr){
System.out.println(name);
}
}
```

## 数组的应用

### 数组反转

```java
public class arr6{
public static void main(String[] args) {
String[] arr = new String[]{"JJ", "DD", "CC", "XX","YY"};
String[] arr1 = new String[arr.length];
//数组的复制(和arr1=arr不同)
System.arraycopy(arr, srcPos: 0, arr1, destPos: 0, arr.length);
for (String arr01 : arr1){
System.out.print(arr01 + " ");
System.out.println();
System.out.print("方法一:");
//数组的反转
//方法一
for (intj=0;j<arr.length/2;ji++){
String temp = arr[j];
arr[j] = arr[arr.length - j - 1];
arr[arr.length - j - 1] = temp;
for (String arr02 : arr){
System.out.print(arr02 + " ");
}
}
//方法二再把arr返一下
System.out.println();
System.out.print("方法二:");
for (inti= 0,j = arr.length - 1; i <j; i++,j--){
String temp2 = arr[i];
arr[i] = arr[j];
arr[j] = temp2;
for (String arr02 : arr){
System.out.print(arr02 + " ");
```

### 线性查找

```java
import java.util.Scanner;
public class arrtest01{
public static void main(String[] args) {
Scanner input = new Scanner(System.in);
String[] arr = new String[]{"JJ", "DD", "CC", "XX", "XX", "٧٧"};
//线性查找
System.out.print("请输入你要查找的字符:");
String test = input.nextline();
boolean count = true;
for (int a = 0; a < arr.length; a++) {
if(test.equals(arr[a])) {
System.out.print("找到了指定元素的位置");
System.out.println(a);
count = false;
break;
(count)
System.out.println("很遗憾,没找到");
}
```

### 二分查找

```java
public static void main(String[] args) {
int[] arr1 = new int[]{-89, -6, 1, 6, 7, 23, 44,77,80,82}
Scanner input = new Scanner(System.in);
System.out.print("请输入你要查找的数字:");
int test1 = input.nextInt();
int start=0;
int end = arr1.length - 1;
while (start<= end){
int middle = (start + end) / 2;
if(test1== arr1[middle]) {
System.out.println("找到了指定元素,位置:"+"["+middle + "]");
break;
} else if (arr1[middle] > test1) {
end = middle - 1;
}else{
start = middle + 1;
}
if(start>end){
System.out.println("未找到指定元素");
}
input.close();
```

### 冒泡排序

```java
public class ArrayTest03 {
public static void main(String[] args) {
//冒泡排序
int [] arr = new int[]{-5٫-9,5,1,9,7,6,5,3,4};
for (int i = 0;i<arr.length-1;i++){
for (int j = 0;j < arr.length - 1 -i;j++){
if (arr[j] > arr[j+1]){
int temp = arr[j];
arr[j] = arr[j+1];
arr[j+1] = temp;
}
for (int num : arr){
System.out.print(num+" ");
}
}
```

### 数组复制

```java
import java.util.Arrays;
import java.util.Scanner;
public class sum {
public static void main(String[] args) {
int [] list = new int[]{34,5,22,-98,-3,-76,0};
//复制 得到新数组
int[] list1 = new int[list.length];
for (int y = 0;y < list.length;y++){
list1[y] = list[y];
}
System.out.println(Arrays.toString(list1));
}
```

### String的方法

![](https://img.f3f3.top/picgo/20260417165917562.png)

```
import java.util.Random;
import java.util.Scanner;
public class arrtest9 {
public static void main(String[] args) {
1储存所有的大、小写字母
char[] letts = new char[52];
for (int i = 0;i<letts.length;i++){
if(i<=25){
//添加a~z
letts[i] = (char)(97+i);
}else {
//添加A~Z
letts[i] = (char)(65+i-26);
}
}
//A转换为ASCII的值
2、随机抽取数组中的索引
Random r = new Random();
String result = "";
for (int i = 0; i < 4; i++) { //4.fori
int randomData = r.nextInt(letts.length);
result +=
letts[randomData];
3、随机抽取一个0-9的数字
int num = r.nextint( bound: 10);
result += num;
System.out.println(result);
}
```



## Arrays方法

![](https://img.f3f3.top/picgo/20260417163604394.png)

```java
public class arr01 {
public static void main(String[] args) {
//1.boolean equals(int[] a,int[] b);判断两个数组是否相等
int [] arr1= new int[]{1,2,5,6};
int [] arr2= new int[]{1,8,2,6,-5};
boolean isEquals = Arrays.equals(arr1,arr2);
System.out.println(isEquals);
//2.String toString(int[] a)输出数组信息
System.out.println(Arrays.toString(arr1));
//3.void fill(int yal)将定值填充到数组中
Arrays.fill(arr1, val: 10);
System.out.println(Arrays.toString(arr1));
//4. void sort(int[] a)
Arrays.sort(arr2);
System.out.println(Arrays.toString(arr2));
// 5.int binarySearch(int[] a,int key)
int [] arr3 = new int[]{-97,24,-56,-4,2,25,46,23,9,82,11,19};
Arrays.sort(arr3);//先进行排序
int index = Arrays.binarySearch(arr3, key: 46);
System.out.println(index);
```

{% folding 参数（可选）, 数组异常 %}
//1,数组脚边越界异常ArrayIndexOutOfBoundsExceptioon
int[] arr1 = new int[]{1,2,3};
//情况一
for (int i = 0;i<= arr1.length;i++){
System.out.println(arr1[i]);
}
//情况二
System.out.println(arr1[-1]);
//2,空指针异常NullPointerException
//情况一
int[] arr2 = new int[]{1,2,5,6};
arr2 = null;
System.out.println(arr2[0]);//情况二
int[][] arr3 = new int[4][];
System.out.println(arr3[0][0]);
//情况三
String[] arr4 = new String[]{"AA","BB","CC"};
arr4[0] = null;
System.out.println(arr4[0].toString

</details>

## 方法

### 初识

```
public class MethodTest1{
public static void main(String[] args) { printlnfo();//调用函数 //主入口
//方法使独立功能实现
11定义格式
//public static void
//调用格式:方法名()
方法名()
//注意1.方法之间不能嵌套
//2、方法需要被调用例如python中的def
public static void printlnfo(){1个用法
System.out.println("姓名小丹丹");
System.out.println("年龄:18");
System.out.println("性别:女");
所有的方法都需要写在public class类名{}里面
}
```

### 传参

```
public class MethodTest3 {
public static void main(String[] args) {
调用函数时传参
rectangle(len:5.5,width:3.3);//实参
//方法的第二种格式:传参public static void方法名(参数1,参数2){}位置传参一一对应
public static void rectangle(double len,double width){//形参1个用法
double area = len*width;
System.out.println(area);
//此代码在终端直接显示
}
```

### 调回

#### 单一元素调回

```
//判断是否含某一元素
public class MthodTest7{}
public static void main(String[] args) {
int[] arr = {1,2,3,4,5,6,7,8,9,10};
boolean b = contains(arr, end: 0);
System.out.println(b);
}
public static boolean contains ( int[]arr, int eend){
for (int i = 0; i < arr.length; i++) {
if(arr[i]==end){return true;}
}
return false;
}
```

#### 多个元素调回

```java
//两个数据传输
public static int[] gerTwonumber2(){ 4个用法
Scanner sc = new Scanner(System.in);
System.out.println("请录入第一个整数");
int num1 = sc.nextInt(
System.out.println("请录入第二个整数");
int num2 = sc.nextInt(
//在java中方法只能返回一个值,多个数据返回需要数组
int[] arr = {num1, num2};
return arr;
```

```java
//复制指定范围的元素
public class MethodTest8 {
public static void main(String[] args) {
int[] arr = {1,2,3,4,5,6,7,8,9,10};
int[]copyarr=printArray(arr, start:1, end:5);
for (inti=0;i<copyarr.length;i++){
System.out.print(copyarr[i]);
public static int[] printArray(int[] arr, int startt, int end){
//定一个新数组去放start到end的元素
int[]newArr = new int[end-start];
// 伪造新数组的索引方便复制
int index=0;
for(inti=start;i<end;i++){
newArr[index] = arr[i];
index++;
return newArr;
```

## 方法重载

## 面向对象

### 认识面向对象

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识</summary>

一、Java面向对象学习的三条主线:
(第4-6章)
1.Java类及类的成员:属性、方法、构造器;代码块、内部类
2.面向对象的三大特征:封装性、继承性、多态性、(抽象性)
3.其它关键字:this、super、static、final、abstract、interface、package、impo
"大处着眼,小处着手"
二、类和对象的使用(面向对象思想落地的实现):
1.创建类,设计类的成员
2.创建类的对象
3.通过"对象.属性"或"对象.方法"调用对象的结构
</details>

```
class Person{
5个用法
//属性javabean
intage=18;4个用法
Stringnames;7个用法
booleanisMale;1个用法
//方法
public void eat(String name){
System.out.println(name+"要吃饭");
public void play(String name){1个用法
System.out.println(name+"喜欢玩游戏");
}
public void ages(String name,int age){1个用法
System.out.println(name+"今年" + age+"岁");
}
public void talk(String language){1个用法
System.out.println("全世界都在说"+language);
public class classTest {
public static void main(String[] args) {
//创建Person类的对象
Person p1 = new Person();
√调用对象的结构:属性、方法
调用属性:对象.属性
p1.names="小明";
p1.isMale = true;
System.out.println(p1.names);
p1.eat(p1.names);
p1.play(p1.names);
p1.ages(p1.names,p1.age);
p1.talk(language:"中国话");
System.out.println("p2
Person p2 = new Person();
System.out.println(p2.names);
System.out.println(p2.age);
System.out.println();
*************************************
System.out.println("p3 ***************
*****************").
Person p3 = p1;
System.out.println(p3.names);
//将p1 变量保存的对象地址赋给了p3导致 p1和p3指向同个堆
p3.age = 21;
System.out.println(p1.age);
//自己的理解就是p1和p3是同一个p3是p1的别名
```

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">对象的内存解析</summary>

分为栈和堆
栈是类中的属性
堆是方法中的局部变量
</details>

### 局部变量和属性的异同

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">两者的区别</summary>

1.相同点:
1.1定义变量的格式:数据类型变量名=变量值
1.2先声明,后使用
1.3变量都有其对应的作用域
2.不同点:
2.1在类中声明的位置的不同
属性:直接定义在类的一对{}内
局部变量:声明在方法内、方法形参、代码块内、构造器形参、构造器内部的变量
2.2关于权限修饰符的不同
属性:可以在声明属性时,指明其权限,使用权限修饰符。
常用的权限修饰符:private、public、缺省、protected
目前,大家声明属性时,都使用缺省就可以了。
--->封装性
局部变量:不可以使用权限修饰符。
</details>

```
属性(成员变量)vs局部变量
public class oop1 {
public static void main(String[] args) {
User p1 = new User();
System.out.println(p1.name);
System.out.println(p1.age);
System.out.println(p1.isMale);
p1.talk(language:"中文");
p1.eat();
class User{2个用法
//属性(成员变量)
Stringname;1个用法
public int age;
booleanisMale;1个用法
public void talk(String language){//Language形参 也是局部变量1个用法
System.out.println("我们使用"+ language+"说话")
public void eat(){String food="烙饼";// 局部变量
System.out.println("北方人喜欢吃"+ food);
```

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">默认初始化情况</summary>

属性:类的属性,根据其类型,都有默认初始化值。
整型(byte、short、int、long):0
浮点型(float、double):0.0
字符型(char):0(或'\u000')
布尔型(boolean):false
引用数据类型(类、数组、接口):nul
局部变量:没有默认初始化值。
意味着,我们在调用局部变量之前,一定要显式赋值。
特别地:形参在调用时,我们赋值即可。
2.4在内存中加载的位置:
属性:加载到堆空间中(非static)
局部变量:加载到栈空间
</details>

### 方法声明

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识</summary>


1.举例:
public void eat(){}
public void sleep(int hour){}
public StringgetName(){}
public StringgetNation(String nation){}
2.方法的声明:权限修饰符 返回值类型方法名(形参列表){
方法体
注意:static、final、abstract来修饰的方法,后面再研。
说明:
3.1关于权限修饰符:默认方法的权限修饰符先都使用public
Java规定的4种权限修饰符:private、public、缺省、protectted
-->封装性再细
3.2返回值类型:有返回值Vs没有返回值
3.2.1如果方法有返回值,则必须在方法声明时,指定返回值的类型。同时,方法中,需要使用
return关键字来返回指定类型的变量或常量:"return数据" 
如果方法没有返回值,则方法声明时,使用void来表示。通常,没有返回值的方法中,就
使用return.但是,如果使用的话,只能"return;"表示结束此方法的意思

4.return关键字的使用:
1.使用范围:使用在方法体中
2.作用:
结束方法
针对于有返回值类型的方法,使用"return数据"方法返回所要的数据
3.注意点:return关键字后面不可以声明执行语句。
5.方法的使用中,可以调用当前类的属性或方法
特殊的:方法A中又调用了方法A:递归方法。
方法中,不可以定义方法。

</details>

#### 练习

```
import java.util.Arrays;
public class oop2 {
public static void main(String[] args) {
Customer p1 = new Customer
p1.name = "Tom";
p1.age = 19;
p1.eat();
p1.sleep(hour:5);
System.out.println(p1.getName());
System.out.println(p1.getNation("中国");
int[] arr = new int[]{1,5,9,-6,-2,4,2};
p1.sort(arr);|
System.out.println(Arrays.toString(arr));
}
J
class Customer{2个用法
//属性
Stringname;2个用法
intage;2个用法
//方法
public void eat(){
System.out.println("吃饭咯");
public void sleep(int hour){1个用法
System.out.println("我睡了"+ hour +"个小时");
//方法内方法
eat();
//sleep(2);
public String getName(){
if (age>18){
return name;
}
else {
return
"小学生";
public String getNation(String nation){1个用法
return"我的国籍是"+ nation;
public void sort(int[] arr){1个用法
for (int i = 0;i<arr.length-1;i++){
for (intj=0;j<arr.length - 1 -i;j++){
if (arr[j] > arr[j+1]){
int temp = arr[j];
arr[j] = arr[j+1];
arr[j+1] = temp;}

```



## 递归性和封装性

### 递归和斐波那契数列

```java
public static void main(String[] args) {
//计算1-100的自然数的和
//方式一
int sum = 0;
for(int i =1;i<=100;i++){
sum += i;
}
System.out.println(sum);
//方式
digui test = new digui(
System.out.println(test.getSum(
//例二
num:100));
System.out.println(test.f( num: 10));
//斐波那契
System.out.println(test.fibonacci( num: 10));
 public int getSum(int num){2个用法
if(num== 1){
return 1;
return num + getsum(num: num-1);
//例题有一个数列f(0)=1,f(1)=4,f(n+2)=2*f(n+1)+f(n)
//求f(10)
public int f(int num){ 3个用法
if(num=== 0){
return 1;
else if (num == 1){
return 4;
return f( num: num-2) + (2*f( num-1));
}
```

```
//斐波那契数列
//1 1 2 3 5 8 13 21 34 55
public int fibonacci(int num){3个用法
if(num== 1|num==2){
return 1;
return fibonacci(num: num-1)+fibonacci(num:num-2);
}
```

### 封装性

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">封装和隐藏</summary>


我们程序设计追求"高内聚,低耦合"。
高内聚:类的内部数据操作细节自己完成,不允许外部干涉步;
低耦合:仅对外暴露少量的方法用于使用。
隐藏对象内部的复杂性,只对外公开简单的接口。便于外界调用,从而提
高系统的可扩展性、可维护性。通俗的说,把该隐藏的隐藏起来,该暴露
的暴露出来。这就是封装性的设计思想。

</details>

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">private关键字</summary>


(1)private关键字:
是一个权限修饰符,用于修饰成员变量和成员方法.
私有是针对类,而不是针对对象,也就是说,同一个类的所有的不同的不同的的对象之间,可以互相访问别的对
象的的私有的成员.
被私有化的成员只在本类中有效.
(2)javabean/常用于:
将成员变量私有化,对外提供对应的set(),get()方法。提高对数据访问的安全性。

</details>

```
public class AnimalTest {
public static void main(String[] args)
Animal animal = new Animal
animal.name="大黄";
animal.age = 5;
animal.setLegs(4);
System.out.println(animal.getlegs
animal.show();
animal.eat
class Animal{2个用法
Stringname;2个用法
intage;2个用法
private int legs;
//属性的设置
//private 4个用法
// 快捷键alt+insert
//ptg一秒生成javaBean类
public void setlegs(int 1){1个用法
if(1>0 0 & 1 % 2 == 0){
legs = l;
else {
legs = 0;
//属性的获取
public int getlegs(){ 1个用法
return legs;
public void eat(){
System.out.println("吃东西");
```

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">封装性体现</summary>


二、封装性的体现:
我们将类的属性xxx私有化(private),同时,提供公共的(public)法来获取(getxxx)和设置
set)
拓展:封装性的体现:
如上
不对外暴露的私有的方法
单例模式 .
三、封装性的体现,需要权限修饰符来配合
1.Java规定的4种权限(从小到大排列)
brivate、缺省、protected 、public

</details>

![](https://img.f3f3.top/picgo/20260420090427567.png)

## 构造器

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识构造器</summary>


类的结构之三:构造器(或构造方法、constructor)的使通
construct:建设、建造。construction:CCB
constructor:建设者
一、构造器的作用:
1.创建对象
2.初始化对象的属性
二、说明:
1.如果没有显式的定义类的构造器的话,则系统默认提供一个空参的构造器
2.定义构造器的格式:权限修饰符 类名(形参列表){}

3.一个类中定义的多个构造器,彼此构成重载
4.一旦我们显式的定义了类的构造器之后,系统就不再提供默认人的空参构造器
5.一个类中,至少会有一个构造器。

</details>

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">作用与特征</summary>


构造器的特征
>它具有与类相同的名称
>它不声明返回值类型。(与声明为void不同)
>不能被static、final、synchronized、abstract、native修饰,不能有return语句返回值
>构造器的作用:创建对象;给对象进行初始化
>如:Ordero=new Order(); Person p = new Person("Peter",15);
>如同我们规定每个"人"一出生就必须先洗澡,我们就可以在"人"的
>构造器中加入完成"洗澡"的程序代码,于是每个"人"
>出生就会自
>动完成"洗澡",程序就不必再在每个人刚出生时一个一个地告诉他们
>要"洗澡"了。

</details>

```
public class constructor1 {
public static void main(String[] args) {
//创建类的对象:new+构造器
Perso p = new Perso();
p.eat();
Perso p1 = new Perso( n: "Tom", a: 18);
p1.show();
class Perso{ 4个用法
Stringname;2个用法
intage;2个用法
public Perso(){1个用法
System.out.println("Person().....");
public Perso(Stringn,inta){1个用法
name = n;
age = a;}


```

### 赋值的过程

```
package oop;
public class constructor2 {
public static void main(String[] args) {
User user = new User();
System.out.println(user.age);
User user1 = new User( a: 2);
user1.setAge(4);
System.out.println(user1.age);
}
}
class User{
String name;|
1个用法
int age=1;
public User(){
1个用法
//空参构造
}
public User(inta){ 1个用法
age = a;
//赋值 构造器中括号中参数
}
public void setAge(int a){
age = a;
```

## 关键字

### static关键字

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识static关键字</summary>


static关键字的使用
1.static:静态的
2.static可以用来修饰:属性、方法、代码块、内部类

3.使用static修饰属性:静态变量(或类变量)
3.1属性,按是否使用static修饰,又分为:静态属性Vs非静态属性(实例变量)
实例变量:我们创建了类的多个对象,每个对象都独立的拥有一套类中的非静态属性。当修改其中一个对象中的非静态属性时,不会导致其他对象中同样的属性值的修改。
我们创建了类的多个对象,多个对象共享同一个静态变量。当通过某一个对象修改静态变量时,会导致
其他对象调用此静态变量时,是修改过了的。
3.2static修饰属性的其他说明:
静态变量:
静态变量随着类的加载而加载。可以通过"类·静态变量"的方式进行调用
静态变量的加载要早于对象的创建。
由于类只会加载一次,则静态变量在内存中也只会存在一份:存在方法区的静态域中。

</details>

![](https://img.f3f3.top/picgo/20260424110613503.png)

```static
class Chinese{
String name;
int age;
static String nation;

public void eat(){
System.out.println("我要吃饭");

public static void show(){
System.out.println("我是一个中国人!");
//不能调用非静态结构 eat() name:= "Tom"方法和属性
System.out.println(Chinese.nation);
walk();//静态方法
System.out.println("nation : "+ nation);
public static void walk(){ 
System.out.println("走路");

public void info(){
System.out.println("name = " + name + " age = " + age)

public class StaticTest {
public static void main(String[] args) {
Chinese.nation="中国人";
Chinese chinese1 = new Chinese();
chinese1.name="汪大东";
chinese1.age = 28;
Chinese chinese2 = new Chinese
chinese2.name="金宝三";
chinese2.age = 34;
Chinese chinese3 = new Chinese
chinese3.name="林丹";
chinese3.age = 32;
Chinese.show() ;
```

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">注意事项</summary>


与this,super不共用，静态调静态。非静态都能调

</details>

### static关键字的应用

#### 修改静态变量

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">静态变量</summary>


静态变量属于类的本身，而非类的实例对象，所有实例共享同一份静态变量

生命周期与类一致，在类加载时初始化，程序结束时销毁，不依赖于对象的创建

静态变量在内存中只有一份拷贝，在JVM加载类的时候，只为静态分配一次内存

访问方式可以直接通过类名.变量名访问，无需创建对象

</details>

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">static的应用场景</summary>


开发中,如何确定一个属性是否要声明为static的?
>属性是可以被多个对象所共享的,不会随着对象的不同而不同的
>
>开发中,如何确定一个方法是否要声明为static的?
>操作静态属性的方法,通常设置为static的
>工具类中的方法,习惯上声明为static的。比如:Math、Arrays、Collections

</details>

```
class Counter {
    static int count = 0; // 静态变量，所有实例共享
    int id; // 实例变量，每个对象独有
    
    public Counter() {
        count++; // 每次创建对象，静态变量自增
        id = count;
    }
}
```

#### 修饰内部类(静态内部类)

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">静态内部类</summary>


静态内部类不依赖外部类的实例，可以直接创建或者通过外部类.内部类访问

静态内部类中不能直接访问外部类的非静态成员

</details>

```java
class Outer {
    static class Inner { // 静态内部类
        void print() {
            System.out.println("静态内部类");
        }
    }
}
 
// 使用方式
Outer.Inner inner = new Outer.Inner();
inner.print();
```

####    静态代码块  

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">静态代码块</summary>
 

静态代码块用static{}定义，在类加载的时候执行，只会执行一次，常用于初始化静态变量

静态导入（Java）：通过import static直接导入类的静态成员，简化调用比如（import static Java.lang.Math.PI）

核心特点总结:static成员属于类，而非对象，节省内存（单份拷贝）生命周期与类绑定，独立于对象的创建/销毁

访问无需实例化，适合定义工具方法、共享状态等场景

</details> 

#### static内存分析

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">static内存分析</summary>
  

类加载的时候，静态变量/方法会被分配到方法区（JDK8后为元空间），而实例变量存储到堆内存中

方法区是线程共享的内存区域，因此静态成员本质上是全局共享资源，所有对象操作的都是同一份数据

</details> 

```java
class Test {
    static int a = 10; // 方法区
    int b = 20;       // 堆内存（每个对象独立）
}
```

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初始化顺序</summary>
 

初始化顺序

静态成员——静态代码块——实例成员——构造代码块——构造方法

静态代码块仅在类第一次加载时执行，按定义的顺序执行

</details>

```java
class InitOrder {
    static int x = 1;
    static { x = 2; } // 静态代码块，类加载时执行
    static { x = 3; } // 后执行，覆盖前值
    
    public static void main(String[] args) {
        System.out.println(x); // 输出 3
    }
}
```

#### 特殊作用

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">设计模式</summary>


静态内部类是独立的类，仅在语法上嵌套在外部类中，不持有外部类的引用

非静态内部类会隐式持有外部类实例的引用，可能导致内存泄漏（内部类生命周期长于外部类）

</details>

```java
class User {
    private String name;
    
    private User(Builder builder) {
        this.name = builder.name;
    }
    
    // 静态内部类作为建造者
    static class Builder {
        private String name;
        
        Builder name(String name) {
            this.name = name;
            return this;
        }        
        User build() {
            return new User(this);
        }
    }
}
 
// 使用：User user = new User.Builder().name("Alice").build();
```

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">线程安全</summary>


静态成员是线程共享的，多线程修改时需注意同步：

</details>

```java
class Counter {
    static int count = 0;//共享数据
    
    // 线程不安全的自增
    static void increment() {
        count++; // 实际包含读取、修改、写入三步，可能被中断
    }
    
    // 线程安全版本（加锁）
    static synchronized void safeIncrement() {
        count++;
    }
}
```

#### 静态方法的限制

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">为什么这样设计</summary>


静态方法在类加载时存在，而实例成员依赖对象创建，此时可能还未初始化，因此编译器禁止直接访问

用于实现工具类（如Java.util.Arrays）：无需维护状态，仅提供功能

用于单例模式：通过静态方法控制对象创建（如getInstance())

</details>

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">为什么没有this关键字</summary>


.没有 this 指针\n\nthis代表当前对象实例，而静态方法属于类，不依赖对象，所以内部不能够使用this和super关键字

</details>

### finally关键字





### this关键字

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识 this调用构造器</summary>


this调用构造器
我们在类的构造器中,可以显式的使用"this(形参列表)"方式,调用本类中指定的其他构造器
构造器中不能通过"this(形参列表)"方式调用自己
如果一个类中有n个构造器,则最多有n-1构造器中使用了"this(形参列表)"
规定:"this(形参列表)"必须声明在当前构造器

</details>

#### 赋值的三种方式

```java
public class this2 {
public static void main(String[] args) {
System.out.println("方式一");
customer cc = new customer( id: 184564, name: "CC");
CC.show(
System.out.println("方式二");
customer dd = new customer
dd.setId(1545);
dd.setName("DD");
dd.show();
System.out.println();
System.out.println("方式三");
customer CC = new customer( id: 18, name: "CC");
System.out.println(CC.getId())
```

#### this调用构造器

```
class Person{
privateStringname;
privateintage;
//无参
public Person
this.name="张三";
this.age = 20;
有参
public Person(String name){
this.name = name;
调用有参构造方法。设置默认值。和第一种方法功能一样
public Person(){0个用法
this(name:"张三",age:20);
//*public Person(String name, int age) {
this.name = name;
this.age = age;
@Override
public String toString() {
return "Person{" +
"name="" + name + '\
", age=" + age +
}
//程序的入口
public class thisDemo01
public static void main(String[] args){
我们创建了一个简单的Person对象,调用的是Person类无参的构造器
在构造器内完成了对成员变量的赋值
Person p = new Person
//输出的结果是 Person{name='张三',age=20}
System.out.println(p);
this()代表调用本类的无参构造（）里有形参为调用有参方法
（）里有具体值调用本类其他方法
```

```
public class Boy{1个用法
privateStringname;2个用法
privateintage;3个用法
public Boy(String name,int age){0个用法
this.name = name;
this.age = age;
public String getName(
return name;
public int getAge(){
return age;
public void marry(Girl){1个用法
System.out.println("我想娶"+girl.getName());
public void shout(){0个用法
if(this.age>=22){
System.out.println("你可以合法结婚了");
```

```
public class Girl{  2个用法
privateStringname;2个用法
privateintage;2个用法
public Girl(String name, int age) {
this.name = name;
this.age = age;
public String getName
return name;
public int getAge(
return age;}
public void marry(Boy boy){0个用法
System.out.println("我想嫁给"+ boy.getName
//this指结构器
boy.marry(girl:this);
public int compare(Girl girl){0个用法
return this.getAge() - girl.getAge( )
```



```java
public class BoyGirlTest {
public static void main(String[] args) {
//创建Boy对象属性
Boy boy=newBoy(name:"罗密欧",age:22);
boy.shout();//调用方法
//创建Girl对象属性
Girlgirl=newGirl(name:"朱丽叶",age:16);
//调用方法
girl.marry(boy);
//再创造一个Girl对象
Girlgirl1=newGirl(name:"祝英台",age:17);
//使用compare方法比较
int compare = girl.compare(girl1);
if(compare<0){
System.out.println(girl.getName()+ "大"+Math.abs(compare)+"岁");
}else if (compare > 0){
System.out.println(girl1.getName()+ "大"+Math.abs(ceompare)+"岁");
}else {
System.out.println(girl.getName()+"利"+girl1.getNam1e()+"一样大");
```

### super关键字

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识super</summary>


1.super理解为:父类的
2.super可以用来调用:属性、方法、构造器
3.super的使用
3.1我们可以在子类的方法或构造器中。通过使用"super.属性"或"super.方法"的方式,显式的调用
父类中声明的属性或方法。但是,通常情况下,我们习惯省略"super. 
3.2特殊情况:当子类和父类中定义了同名的属性时,我们要想在子类中调用父类中声明的属性,则必须显式的
使用"super.属性"的方式,表明调用的是父类中声明的属性。
3.3特殊情况:
使用"super.方法"的方式,表明调用的是父类中被重写的方法
super调用构造器
4.1我们可以在子类的构造器中显式的使用"super(形参列表)"的方式,调用父类中声明的指定的构造器
4.2 "super(形参列表)"的使用,必须声明在子类构造器的首行!
4.3我们在类的构造器中,针对于"this(形参列表)"或"super(形参列表)"只能二选一,不能同时出现
4.4在构造器的首行,没有显式的声明"this(形参列表)"或"super(参列表)",则默认调用的是父类中空参的构造

</details>

```java
public class Person {
String name;
int age;
intid=411024;//身份证
public Person(){
System.out.println("Person我还是在的");
public Person(String name) {
this.name=name;
public Person(String name, int age) {
this.name=name;
this.age=age;}
public void eat(){
System.out.println("人要吃饭");
public void walk(){
System.out.println("人走路");

public class Student extends Person {
String major;
intid=1002;//学号
//默认调用了父类空参的构造器
public Student(){}
public Student(String major) {this.major=major;}
public Student(String name, int age, String major, int id) {
super(name, age);
this.major=major;
this.id=id;
@Override
public void eat() {
System.out.println("学生要吃营养餐");    
public void study(){
super.eat();
System.out.println("学生学习知识");
public void show(){
System.out.println("name="+this.name+age= = "+age+"id= "+super.id);
System.out.println("name= "+ this.name +"age="+age+"id= " id = + id);
System.out.println("name="+ this.name+ "age=" age=" id=" id="+this.id)

public class super Test {
public static void main(Stringħ args) {
Student student=new Student("物联网");
student.name="汪大东";
student.show();
student.study();
student.eat();
System.out.println(
Student student1=new Student("汪大东",28,"终极一班",3);
student1.show()
:
```

```java
Person我还是在的
name汪大东age=0id=411024
name汪大东age=0id=1002
name汪大东age=0id=1002
***
*****
人要吃饭
兴牛当习知识
学生学习知识
学生要吃营养餐
*********
*************************
name= 汪大东 age = 28 id = 411024
name=汪大东 age=28 id = 3
name= 汪大东 age = 28 id = 3
super(name,age)是对父类属性的初始化  利用方法重载和方法的重写
​默认调用父类空参构造，
```

## 继承

### 方法重写

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">重写和重载的区别</summary>


面试时,问:重载(Overload)和重写(Override)的区别?
答:方法的重载和重写都是实现多态的方式,区别在于前者实现现的是编译时的多态性,而后者实现的是运行时的多态性。重载发生在一个类中,同名的方法如果有不同的参数列表(参数类型不同、参数个数不同或者二者都不同)则视为重载;重写发生在子类与父类之间,重写要求子类被重写方法与父类被重写方法有相同的参数列表,有兼容的返回类型,比父类被重写方法更好访问,不能比父类被重写方法声明更多的异常(里氏代换原则)。重载对返回类型没有特殊的要求,不能根据返回类型进行区分。

</details>

{%folding red 初识继承%}

面向对象的特征之二:继承性 why?
一、继承性的好处:
减少了代码的冗余,提高了代码的复用性便于功能的扩展为之后多态性的使用,提供了前提
二、继承性的格式:classAextends
A:子类、派生类、subclass
B:父类、超类、基类、superclass
体现:一旦子类A继承父类B以后,子类A中就获取了父类B中声月的结构:属性、方法

Java中关于继承性的规定:
1.一个类可以被多个子类继承。
2.Java中类的单继承性:一个类只能有一个父类
3.子父类是相对的概念。
4.子类直接继承的父类,称为:直接父类。间接继承的父类称为:间接父类
5.子类继承父类以后,就获取了直接父类以及所有间接父类中声明的属性和方法
1.如果我们没有显式的声明一个类的父类的话,则此类继承于java.lang.Object类
2.所有的java类(除java.lang.Object类之外)都直接或间接的维承于java.lang.Object类
3.意味着,所有的java类具有java.lang.Object类声明的力能

</details>

```java
public class A01{
private double radius;
public A01(){this.radius = 1.0;}
public double getRadius()
return radius;
public void setRadius(double radius) {
this.radius = radius;
public double findArea(){ 0个用法
return Math.PI * radius*radius;

public class A02 extends A01{ 2个用法
privatedoublelength;4个用法
public A02(){1个用法
this.length =1.0;
public double getlength()
return length;
public void setlength(double length) {
this.length = length;
public double findVolume(){
//调用 父类的方法return findArea*1ength;

public class A03 {
public static void main(String[] args) {
A02 cylinder = new A02();
cylinder.setRadius(2.1);
cylinder.setLength(3.4);
double volume = cylinder.findVolume();
System.out.println("半径是:"+cylinder.getRadius())
System.out.println("圆柱的体积是:"+String.format("%.2f",volume));
double area = cylinder.findArea();
System.out.println("圆柱的底面积是:"+String.format(("%.2f",area));

```

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识方法重写</summary>


返回值是父类的子类子类的权限要大于父类
重写就是将父类的方法,同名同参数的修改

1.重写:子类继承父类以后,可以对父类中同名同参数的方法,进行覆盖操作
2.应用:重写以后,当创建子类对象以后,通过子类对象调用子父类中的同名同参数的方法时,实际执行的是子类重写父类的方法
3.重写的规定;
方法的声明:权限修饰符 返回值类型 方法名(形参列表) throws 异常的类型{
//方法体
约定俗称:子类中的叫重写的方法,父类中的叫被重写的方法
子类重写的方法的方法名和形参列表与父类被重写的方法的方法名和形参列表相同
子类重写的方法的权限修饰符不小于父类被重写的方法的权限修饰符

特殊情况:子类不能重写父类中声明为private权限的方法
返回值类型:
父类被重写的方法的返回值类型是void,则子类重写的方法的返回值类型只能是void
父类被重写的方法的返回值类型是A类型,则子类重写的方法的返回值类型可以是A类或A类的子类
父类被重写的方法的返回值类型是基本数据类型(比如:double),则子类重写的方法的返回值类型必须是相同
子类重写的方法抛出的异常类型不大于父类被重写的方法抛出的异常类型

子类和父类中的同名同参数的方法要么都声明为非static的(考)虑重写),要么都声明为static的(不是重写)

</details>

```
public class Person
String name;
private int age;
public Person(
}
public Person(String name, int age) {
this.name = name;
this.age = age;
}
public void eat()
System.out.println("要吃饭");
public void walk(int distance){System.out.println("走路走了"+distance+"公里");}
public void setAge(int age) {this.age = age;}
public int getAge(){return age;}

```

```
public class Student extends Person {
String major;
public Student(){}
public Student(String major) {
this.major = major;
public void majors(){
System.out.println("专业是"+ major);
public void eat(){
System.out.println("学生吃饭10分钟");
}
}
```

```
public class KidsTest {
public static void main(String[] args) {
Kids someKid = new Kids(13);
someKid.printAge();
//设置属性
someKid.setSalary(0);
someKid.setSex(1);
someKid.employed();
someKid.manOrWoman();
```

### 方法重载

## 多态

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识多态</summary>


1.理解多态性:可以理解为一个事物的多种形态。
2.何为多态性:
对象的多态性:父类的引用指向子类的对象(或子类的对象赋给父类的引用
3.多态的使用:虚拟方法调用
有了对象的多态性以后,我们在编译期,只能调用父类中声明的方法,但在运行期,我们实际执行的是子类重写父类的方法。
总结:编译,看左边;运行,看右边。
4.多态性的使用前提:
类的继承关系
方法的重写
5.对象的多态性,只适用于方法,不适用于属性(编译和运行都看左边)

</details>

![](https://img.f3f3.top/picgo/20260420163422920.png)

```java
public class Perso{
String name;
int age;
public void eat(){}
System.out.println("人吃饭");
public void walk(){System.out.println("人走路");

public class Man extends Perso{
boolean isSmoking;0个用法
public void earnMoney(){ System.out.println("男人负责养家");
public void eat(){System.out.println("男人吃得多");//重写父类的方法}
public void walk(){System.out.println("人走路霸气侧漏");

public class Women extendsPerso
booleanisBeauty;
public void goshopping(){System.out.println("女人喜欢购物");
public void eat () {System.out.println("女人吃得少减肥");
public void walk(){System.out.println("女人走路拽");
```

```java
public static void main(String[] args) {
Perso p1 = new Perso();
p1.eat();
Man man = new Man(
man.eat()
man.age = 25;
man.earnMoney();
//****************************
11对象的多态性:父类的引用指向子类的对象
System.out.println("******************);
Perso p2 = new Man();
//多态的使用:当调用子父类同名同参数的方法时,实际执行的是子类重写的方法--虚拟方法调用
p2.eat();
p2.walk();
//p2.earnMoney();子类和父类的方法都有才可以调用
Perso p3=new Women();
p3.eat();
//人吃饭
//男人吃得多
//男人负责养家
 
 //男人吃得多
//人走路霸气侧漏
//女人吃得少减肥
```

![](https://img.f3f3.top/picgo/20260420164412440.png)

### 向下转型

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识</summary>


//使用强转时,可能出现ClassCastException的异常。
Woman w1 = (Woman)p2;
w1.goShopping();
instanceof关键字的使用
a instanceof A:判断对象a是否是类A的实例。如果是,返回true;如果不是,返回false。
使用情境:为了避免在向下转型时出现ClassCastException的异常,我们在向下转型之前,先
进行instanceof的判断,一旦避回true,就进行向下转型,如果返回false,不进行向下转型、
如果ainstanceof A返回true,则a instanceofB也返回Itrue.
其中,类B是类A的父类。

</details>

![](https://img.f3f3.top/picgo/20260420165440784.png)

### 调用方法和属性

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">编译规则深入</summary>


1.若子类重写了父类方法,就意味着子类里定义的方法彻底覆盖了父类里的同名方法,
系统将不可能把父类里的方法转移到子类中:编译看左边,运行看右边
2.对于实例变量则不存在这样的现象,即使子类里定义了与父类完全相同的实例变量,
这个实例变量依然不可能覆盖父类中定义的实例变量:编译运行都看左边

</details>

```java
class Sub extends Base {
int count = 20;
public void display(){
System.out.println(this.count);
public class FieldMethodTest {
public static void main(String[] args) {
Subs=newSub();
System.out.println(s.count);//20
s.display();//20
Baseb=s;//多态性
//==:对于引用数据类型来讲,比较的是两个引用数据类型变量的地址值是否相同
System.out.println(b == s);//true
System.out.println(b.count);//10
b.display();//20
   // b.count是成员变量仅隐藏无多态则是直接调用父类
```

## Object类下重写方法

### equals方法

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">equals方法和==的区别</summary>

==:运算符的使用:
1.可以使用在基本数据类型变量和引用数据类型变量中
2.如果比较的是基本数据类型变量:比较两个变量保存的数据是否相等。(不一定类型要相同)
如果比较的是引用数据类型变量:比较两个对象的地址值是否相同。即两个引用是否指向同一个对象实体

</details>

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识 equals 方法</summary>


二、equals()方法的使用:
1.是一个方法,而非运算符
2.只能适用于引用数据类型
3.Object类中equals()的定义:
public boolean equals(Object obj) {
return (this == obj);
说明:Object类中定义的equals()和==的作用是相同的;比较两个双才家的地址值是否相同.即两个引用是否
4.像String、Date、File、包装类等都重写了Object类中的equals()方法。重写以后,比较的不是
两个引用的地址是否相同,而是比较两个对象的"实体内容"是否相同。
通常情况下,我们自定义的类如果使用equals()的话,也通常是比较两个对象的"实体内容"是否相同。那么,
就需要对Object类中的equals()进行重写.
重写的原则:比较两个对象的实体内容是否相同。

</details>

```java
class MyDate{7个用法
private int day; 
private int month;
private int year
public MyDate(){}
public MyDate(int day, int month, int year){
this.day = day;
this.month = month;
this.year = year;}
public boolean equals(Object o){
if(this== 0){
return true;
//mydate继承于object类 equls父类独有的方法
//向下转型
if(o instanceof MyDate){
MyDate myDate = (MyDate) o;
return this.day == myDate.day && this.month == myəDate.month && this.year myDate.year; 
else{return false;}



public static void main(String[] args) {
MyDate myDate1 = new MyDate( day: 14, month: 3, year1976);
MyDate myDate2 = new MyDate( day: 14, month: 3, year: 19766);
if(myDate1.equals(myDate2)){
System.out.println("myDatel is equal to myDate2")}
else{System.out.println("myDatel is not equal to myDate2");
if(myDate1==myDate2){System.out.println("myDatel == myDate2");
else{System.out.println("myDate1 != myDate2");}
```

### Tostring 方法

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识tostring方法</summary>


1.当我们输出一个对象的引用时,实际上就是调用当前对象的toString((
2.Object类中toString()的定义:
public String toString(){return getClass().getName() + "@" + Integer.toHexSString(hashCode)}
3.像String、Date、File、包装类等都重写了Object类中的tosttring()方法
使得在调用对象的tostring()时,返回"实体内容"信息
4.自定义类也可以重写tosTring()方法,当调用此方法时,返回对时象的"实体内容"

</details>

```java
public class Tostring{
protected String color;
protected double weight;
protected Tostring(){
this.color = "white";
this.weight = 1.0;
public Tostring(String color, double weight) {
this.color = color;
this.weight = weight;
public String getColor(){return color;}
public void setColor(String color) {this.color = color;}
public double getWeight(){return weight;}
public void setWeight(double weight) {this.weight = weight;}
```

```java
public class Tostring1 extends Tostring{
private double radius;
public Tostring1(){
super();
this.radius = 1.0;}
public Tostring1(double radius){
this.radius = radius;
public Tostring1(double radius,String color,dlouble weight){
super(color, weight);
this.radius = radius;
public double getRadius(){return radius;}
public void setRadius(double radius){
this.radius = radius;
public double findArea(){ 
return Math.PI * radius *radius;}
//多态向下转型
 public boolean equals(Object obj){
if(obj== this){return true;}

if (obj instanceof Tostring1){
Tostring1 circle = (Tostring1) obj;
return circle.findArea() = this.findArea();
return false;
@Override
public String toString() {
return"圆的面积:"+findArea
}
   
```

```java
public class TostringTest {
public static void main(String[] args) {
Tostring1 circle1 = new Tostring1( radius:2.3);/父类空参中已定义
Tostring1 circle2 = new Tostring1( radius: 2.3, color: *"white", weight: 2.0)
System.out.println("颜色是否相等:"+circle1.getColor().equals(circle2.getColor()))
System.out.println("面积是否相等:"+circle1.equals(circle2));
System.out.println(circle1);
System.out.println(circle2.toString());
//未传参时默认super()调用父类的空参，传参时默认调用父类的属性，实现初始化    
```

## String

### 初识数据类型

```java
//int a =10;基本数据类型
//引用数据类型String a="hello"//串池中的地址值
//string s1=new String("hello")输入的内容 //堆中的地址值
//==基本数据类型  数值内容 引用数据类型 地址值
//equals()方法完全相等equals IgnoreCase(比较对象)忽略大小写
public static void main(String[] args) {
String rightusername = "liyifei";
String rightpassword="123456";//串池中的地址值
Scanner sc = new Scanner(System.in);
for(int i=0;i<3;i++){
System.out.println("请输入用户名");
String username =sc.next();
System.out.println("请输入密码");
String password =sc.next();
if(username.equals(rightusername) && password.equals(rightpassword))
System.out.println("登录成功");
break;
} else {
if(i== 2){
System.out.println("下次账号被锁定");
} else{
System.out.println("用户名或密码错误,请重新输入你还剩"+(2-i)+"次机会");
```

### 遍历字符串

```
import java.util.Scanner;
public class s2 {
public static void main(String[] args) {
Scanner sc = new Scanner(System.in);
System.out.println("请输入一个字符串");
String a = sc.next();
//遍历字符串 
//字符串遍历快捷键str.length().for
for (int i = 0; i < a.length(); i++) {
char c=a.charAt(i);//ctrl+alt+v自动生成变量
System.out.println(c);
```

### 统计个数

```
public class s3{
public static void main(String[] args) {
//统计大小写次数
Scanner sc = new Scanner(System.in);
System.out.println("请输入一个字符串");
String a = sc.next();
int bigCount = 0;
int smallCount = 0;
int numberCount = 0;
//遍历字符串str.length().for
for (int i = 0; i < a.length(); i++) {
char c = a.charAt(i);//取出对应索引的字符
if(c>='a' &&c<= 'z'){
//char类型的变量在参与计算时会自动转换成int查询ascll码表
bigCount++;
}elseif(c>='A' 'A' && c <= 'Z') {
small Count++;
}elseif(C >= '0' && C<= '9'){numberCount+;}
}
System.out.println("大写字母的个数是:"+bigCount);
System.out.println("小写字母的个数是:"+smallCount);
System.out.println("数字的个数是:"+numberCount);}
```

### 拼接数组

```
public static void main(String[]args){
int[] arr = {1,2,3,4,5};
String s = arrToString(arr);
System.out.println(s);
public static String arrToString(int[] arr){
if(arr == null){
return"";
if(arr.length == 0){
return"[]";
String result="[";
for (int i = 0; i < arr.length; i++) {
if(i == arr.length-1){
result = result+arr[i];
}else{
result = .
result +arr[i]
//拼接右括号
result= result + "]";
return result;
```

### 反转字符串

```java
public static void main(String[] args) {
//反转字符串("abcdefg");
String result=reverse( str: "abcdefg");
System.out.println(result);
public static String reverse(String str){/shift+f6批量修改
//str.length().forr反转遍历
String result = "";
for (int I = str.length()-1; I >= 0; I--) {
char c=str.charAt(I); //ctrl+alt+v自动生成变量
result = result + C;
}
return result;
```

### substring

```java
public class |s7 {
public static void main(String[] args) {
//获取一个手机号
String phonNunber="13112349468";
//截取手机号
String start=phonNunber.substring(0,3);//左闭右开
String end=phonNunber.substring(beginlndex: 7);
//sub string有返回值需要变量去接受
String result=start+********+end;
System.out.println(result);
//定义一个身份证号
String idNumber="321281202001011234";
String year=idNumber.substring(6,10);
String month=idNumber.substring(10,12);
String day=idNumber.substring(12,14);
//获取性别
char c=idNumber.charAt(16);//字符如何转为数字
//利用ACSII码表
System.out.println('0'+0);//两者相差48
int num=c-48;
if(num%2==1){System.out.println("男");}
else{System.out.println("女");}
```

### 替换字符

```java
public class s8 {
public static void main(String[] args) {
//获取获取所说的话
String talk="你玩的真好以后别玩了,TMD,CNM,SB,MLGB";
//构建敏感词汇库
String[] arr={"TMD", "CNM", "SB", "MLGB"};
for (int i = 0; i < arr.length; i++) {
//获取敏感词汇 
String badWord = arr[i];
//替换敏感词汇
talk = talk.replace(badWord, replacement: "******");//replace()结果有返回值需要有变量接受
System.out.println(talk);
```

### Stringbuilder

```java
public class s9 {
public static void main(String[] args) {
//1.创建对象
StringBuilder sb=new StringBuilder("abc");
//2.添加数据
sb.append("hello");
sb.append("world");
sb.append("java");
//3.将StringBulider转换成String
String s=sb.toString();
System.out.println(s);
//反转
sb.reverse();
System.out.println(sb);
int len =sb.length();
System.out.println(len);
//因为StringBulider是java的写好类  //Stringbuilder就是个容器
//java在底层对他做了一些特殊的处理
//打印对象不是地址值而是属性值
```

### 回文字符串

```java
public class s10 {
public static void main(String[] args) {
//键盘获取一个字符串
Scanner sc = new Scanner(System.in);
System.out.println("请输入一个字符串");
Stringstr=sc.next(
//反转字符串 //空参构造
String result=new StringBuilder().append( str).reverse().toString();
if(str.equals(result)){
System.out.println("是回文");
}
else{
System.out.println("不是回文");
}
```

```java
public class s11 {
public static void main(String[] args) {
//定义数组
int[]arr={1,2,3,4,5,6,7,8,9,10};
String s=arrToString(arr);
System.out.println(s);
public static String arrToString(int[] arr){
1个用法
StringBuilder sb=new StringBuilder();
sb.append("["]
for (int i = 0; i < arr.length; i++) {
if(i== arr.length-1){
sb.append(arr[i]);
}else{sb.append(arr[i]+",");
}
sb.append("] ) ز ("] ؟
return sb.toString();
}
//Stringjoiner sj=new   Stringjoiner(",");必须有间隔符不能空参
//sj.add("1").add("2").add("3");
//String s=sj.toString();
//StringJoiner sj=new StringJoiner(","开始字符","结束字符");
```

## 抽象类abstract

原文链接：https://blog.csdn.net/tyra9/article/details/129137305

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识抽象类</summary>


**abstract关键字**的使用
1.abstract:抽象的
2.abstract可以用来修饰的结构:类、方法
3.abstract修饰类:抽象类
此类不能实例化 ，创建对象

抽象类中一定有构造器,便于子类实例化时调用(涉及:子类对象实例化的全过程)
开发中,都会提供抽象类的子类,让子类对象实例化,完 成相关的操作
4.abstract修饰方法:抽象方法
抽象方法**只有方法的声明,没有方法体**
**包含抽象方法的类,一定是一个抽象类。反之,抽象类中可以没有抽象方法的**
若子类重写了父类中的所有的抽象方法后,此子类方可实例化
若子类没有重写父类中的所有的抽象方法,则此子类也是一个抽象类,需需要使用abstract修饰

</details>

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">应用抽象类的场景</summary>


1.当父类需要定义一个方法，却不能明确该方法的具体实现细节时，可以将该方法定义为abstract，具体实现细节延迟到子类

</details>

```
abstract class Creature{ public abstract void breath();}

abstract class Person extends Creature{ 
String name;
int age;
public Person(){
public Person(String name, int age) {
this.name = name;
this.age = age;
public void eat(){ System.out.println("吃饭");}
public void walk(){System.out.println("走路");}
public abstract void hello(); 

class Student extends Person{ 
public Student(){}
public Student(String name,int age){
super(name,age);
public void eat(){
System.out.println("学生要吃有营养的");

@Override 
public void hello() {
System.out.println("你好啊");//不同人的打招呼方式不同
@Override 
public void breath() {
System.out.println("学生应该呼吸新鲜空气");
//public abstract void work();//alt+enter添加方法体因为每个子类方法体内容不同,所以不能写方法体

public class objectqw {
public static void main(String[] args) {
Student student1 = new Student();
Student student2=new Student(name:"王小明",age28);
System.out.println("学生1:"+student1.name+","+student1.age+"岁");
System.out.println("学生2:"+student2.name+","+student2.age+"岁");
student1.eat();
student1.hello();
student1.breath();
student2.eat();
```

 <details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">特点</summary>


1.若父类中定义了一个**抽象方法**，**要求其所有非抽象子类都必须重写**该抽象方法

2.抽象方法不能再使用private，final 或者static关键字来修饰，即abstract不能与private，final或static共同出现，**这是因为定义抽象方法的目的就是想将方法的具体实现延迟到子类，最终是要被子类重写的**，而private，final，static这几个关键字都和“方法重写”的目的背道而驰。

3.访问权限修饰符 abstract class 类名{ // }

访问权限修饰符 abstract 返回值类型 方法名(形参列表)

4.我们不能创建抽象类对象（这里的对象指的是堆空间中真正的对象，即不能“new 抽象类”

如果抽象类的子类没有用abstract关键字修饰，那么我们可以创建其子类对象

</details>

```java
package knowledge.polymorphism.about_abstract.about_members;
 
public abstract class Fruit {        //Fruit类是抽象类
//抽象类中可定义的成员：
    //1.非静态变量和静态变量
    private String name = "水果名儿是有长有短";
    private static String size = "水果的大小是有大有小";
 
    //2.非静态常量和静态常量
    public final String COLOR = "水果的颜色是五光十色";
    public static final String FORM = "水果的形态是千奇百怪";
 
    //3.抽象方法和非抽象方法
    public abstract void nutrition();
    private final static void suitCrowds() {
        System.out.println("人人都适合吃水果！");
    }
    public void invokeSuitCrowds() {
        Fruit.suitCrowds();
    }
 
    //4.构造器可以重载
    public Fruit() {
        System.out.println("Fruit's name = " + name);
    }
    public Fruit(String name) {
        this.name = name;
    }
}
```

## 接口

### 初识

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识接口</summary>


**接口（Interface）**是一种引用数据类型，类似于类，然而它只能包含常量、方法签名和嵌套类型。接口不能包含实例变量或方法的实现（在Java 8及之后的版本，可以在接口中定义默认方法和静态方法）。接口主要用于定义类的外部行为，并允许类实现这些行为。

</details>

```
public interface Animal {
    // 常量
    int LEGS = 4; // 默认有修饰符 public static final
    // 抽象方法
    void makeSound();// 默认有修饰符 public abstract
    void eat();// 默认有修饰符 public abstract
}
//接口实现
public class Dog implements Animal {
    @Override
    public void makeSound() {
        System.out.println("Woof!");
    }
 
    @Override
    public void eat() {
        System.out.println("Dog is eating.");
    }
}
//抽象类的使用  通过接口引用实现类对象，可以实现多态性（类似于父类引用指向子类对象）编译左边运行右边
public class Main {
    public static void main(String[] args) {
        Animal myDog = new Dog();
        myDog.makeSound(); // 输出: Woof!
        myDog.eat();       // 输出: Dog is eating.
    }
}
```

### 特点

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">接口的特点</summary>


1.方法公有性和抽象性 ,接口中的方法都默认是 public 的，而且必须是 public 的，因为 private 和 protected 修饰符都不能在接口中使用，public abstract

2.变量默认为公有静态常量,接口中定义的变量默认是 public static final 修饰的，即静态常量，所有实现该接口的类都可以访问这些常量。因为接口中不能使用 private 和 protected 修饰符，所以接口中的属性也都是公有的int a = 0;// 默认有修饰符 public static final调用接口名.变量名

3、不能被实例化

4.**默认方法（default）**：默认方法可以有方法体。默认方法不需要实现接口的类去实现，但是它们仍然是 public 的

**静态方法（static）**：静态方法也有方法体，不需要实现接口的类实现，这些方法也是 public 的，并且可以在接口本身上调用 对于**默认方法**，实现这个接口的类可以重写它

5,一个普通类实现接口，则需要将接口中的所有抽象方法实现。如果是一个抽象类实现接口，则是否实现抽象方法都行。

```java
interface Interface {
	void foo();
}
 
abstract class AbstractClass implements Interface{
	// 抽象类实现接口，可以不实现接口的抽象方法
}
```

因为抽象类中是允许有抽象方法的，但是普通类中不允许有抽象方法。

6、接口之间的继承

接口不能继承某个类，但是接口可以继承接口**Java接口支持多重继承**，一个接口可以继承多个其他接口。这与类的继承不同，类在Java中只能单继承（即一个类只能继承一个父类）。



</details>

### 接口多态的实现

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识</summary>


java中的类不能多重继承（一个子类继承多个基类），但一个类可以实现多个接口，这样就实现了多重继承的效果。这种特性称为**多重接口实现**。

1、语法与要求

一个类实现多个接口时，接口名之间用逗号分隔

```
abstract class Animal {
	private String name;
```



	public Animal(String name) {
		this.name = name;
	}
	 
	public abstract void cry();


```
interface ShakeHands {
	void shakeHands();
}

interface SpinningAround {
	void spinningAround();
}

class Dog extends Animal implements ShakeHands, SpinningAround {
	public Dog(String name) {
		super(name);
	}
```



	@Override
	public void cry() {
		System.out.println("汪汪~");
	}
	 
	@Override
	public void shakeHands() {
		System.out.println("握手~");
	}
	 
	@Override
	public void spinningAround() {
		System.out.println("转圈圈~");
	}


</details>

#### 接口解耦

```java
// 定义支付接口
interface Payment {
    void pay(double amount);
}
 
// 实现信用卡支付
class CreditCardPayment implements Payment {
    @Override
    public void pay(double amount) {
        System.out.println("Paid " + amount + " using Credit Card.");
    }
}
 
// 实现支付宝支付
class AlipayPayment implements Payment {
    @Override
    public void pay(double amount) {
        System.out.println("Paid " + amount + " using Alipay.");
    }
}
 
// 使用支付接口的用户类
class ShoppingCart {
    private Payment payment;
 
    public ShoppingCart(Payment payment) {
        this.payment = payment;
    }
 
    public void checkout(double amount) {
        payment.pay(amount);
    }
}
//ShoppingCart 类与具体的支付方式（如CreditCardPayment或AlipayPayment）没有直接的依赖关系。你可以轻松地在不修改 ShoppingCart 类的情况下，添加新的支付方式，只需实现 Payment 接口即可。
 
// 测试代码
public class Main {
    public static void main(String[] args) {
        Payment creditCardPayment = new CreditCardPayment();
        ShoppingCart cart1 = new ShoppingCart(creditCardPayment);
        cart1.checkout(100.0); // 使用信用卡支付
        Payment alipayPayment = new AlipayPayment();
        ShoppingCart cart2 = new ShoppingCart(alipayPayment);
        cart2.checkout(150.0); // 使用支付宝支付
    }
}
```

#### 数组多态

```
package com.study.episode10.Interface.Example3;
 
public class Example {
	public static void main(String[] args) {
		InterfaceCry[] ic = new InterfaceCry[2];
		ic[0] = new Dog();
		ic[1] = new Cat();
		for(InterfaceCry i : ic) {
			i.cry();
		}
	}
}
 
interface InterfaceCry {
	void cry();
}
 
class Dog implements InterfaceCry {
	@Override
	public void cry() {
		System.out.println("Woof~");
	}
}
 
class Cat implements InterfaceCry {
	@Override
	public void cry() {
		System.out.println("Meow~");
	}
}
```

#### 多态参数

```java
package com.study.episode10.Interface.Example3;
 
public class Example {
	public static void animalCry(InterfaceCry ic) {
		ic.cry();
	}
 
	public static void main(String[] args) {
		Dog dog = new Dog();
		Cat cat = new Cat();
		animalCry(dog);
		animalCry(cat);
	}
}
 
interface InterfaceCry {
	void cry();
}
 
class Dog implements InterfaceCry {
	@Override
	public void cry() {
		System.out.println("Woof~");
	}
}
 
class Cat implements InterfaceCry {
	@Override
	public void cry() {
		System.out.println("Meow~");
	}
}
```

#### 接口的上下转型

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识</summary>


在进行过向上转型后，也就是接口类型的引用指向实现类的对象，这时，只能通过引用变量访问 接口中有的成员，不能访问实现类的特有成员，如果想要访问实现类的特有成员，则需要进行向下转型：

</details>

```java
public class Example {
	public static void main(String[] args) {
		Interface i = new ImplementingClass();
		System.out.println(i.specificField);// 接口特有字段，接口中有的成员，所以能访问
		i.commonMethod();// 共有成员，接口中也有，所以能调用
 
		// i.specificMethod; // 这里就会报错，因为接口中没有这个成员，
		// 这是实现类的特有成员，如果要访问，则需要向下转型
 
		((ImplementingClass)i).specificMethod();// 向下转型后访问实现类的特有成员
	}
}
 
interface Interface {
	String specificField = "Interface specific field~";
	void commonMethod();
}
 
class ImplementingClass implements Interface {
	@Override
	public void commonMethod() {
		System.out.println("common method~");
	}
 
	public void specificMethod() {
		System.out.println("implementing class specific method~");
	}
}
```

### 创建对象的方式

```java
//1.创建了非匿名实现类的非匿名对象
Flash flash = new Flash();
computer.transferData(flash);
System.out.println();
//相当于new Flash()
System.out.println("*********************
//2.创建了非匿名实现类的匿名对象
computer.transferData(new Flash());//Usb传参对象
computer.transferData(new Printer());
System.out.println();
System.out.println("********************1
//3.创建了匿名实现类的非匿名对象
USB phone = new USB()//匿名对象
{@override 
public void start(){
System.out.println("手机工作");
@override 1个用法
public void stop() {
System.out.println("手机结束工作");}
//4.创建了匿名实现类的匿名对象
new USB(){@override 1个用法
public void start(){
System.out.println("mp3工作");
}
@override 1个用法
public void stop() {
System.out.println("mp3结束工作");} 
```

#### 圆的练习

```java
//关于圆的javabean类
public classCircle{
private double radius; 
public Circle(){} 
public Circle(double radius){
this.radius = radius;
public double getRadius(){return radius;}
public void setRadius(double radius) {this.radius = radius;}

public interface CompareObject {
int compareTo(Objecto);//若返回值是0代表相等 若正数 代表当前对象大负数代表当前对象小}
 
public class comparableCircle extends Circle implements CompareObject{
public comparableCircle(){0个用法
}
public comparableCircle(double radius){3个用法
super(radius);//调用父类的构造方法
}
@override 2个用法
public int compareTo(Object o) {
if(this == 0){return 0;}
//向下转型使用子类的特有方法Circle里是属性在对象里调用子类特有的get方法
if (o instanceof comparableCircle){
comparableCircle obj = (comparableCircle) o;
return Double.compare(this.getRadius(), obj.getRaddius())
}else {return 12138;} 
    
public static void main(String[] args) {
comparableCircle comparableCircle1 = new
comparableCircle(radius: 1.9);
comparableCircle comparableCircle2 = new comparableCircle( radius: 8.2)
comparableCircle comparableCircle3 = new comparableCircle( radius: 8.2)
int num = comparableCircle1.compareTo(comparableCircle2)
if(num=== 0){
System.out.println("一样大");
}else if (num > 0){
System.out.println("前面大");
}else
System.out.println("后面大");
*********************************
int num1 = comparableCircle3.compareTo(comparableCircle2)
if(num1== 0){
System.out.println("一样大");
}else if (num1 > 0){
System.out.println("前面大");
}else
System.out.println("后面大");
    
    
```

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">abstract不与其他关键字共存的原因</summary>


注意事项:abstract关键字不可以与final、private 、static关键健字共存,因为被final修饰的方法不可以被重写,意味着子类不可以重写该方法,如果abstract和fina共同修饰父类中的方法,子类要实现
抽象方法(abstract的作用),而final又不让该方法重写,这相互矛盾。如果private和abstract共同修饰父类中的方法,private修饰则该方法不可以被子类访问,但是abstract修饰需要子类去实现,两者产生矛盾。

如果static和abstract共同修饰父类中的方法,stattic表示是静态的方法,随着类的加载而加载,则该方法不需要在子类中去实现,这与abstract关键字矛盾。

</details>

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">关键字三者应用场景</summary>


一、static 、final、abstract 三者的使用场景与注意事项
static关键字可用于修饰成员变量和成员函数,想要实现对象中的共性数据的对象共享,可以将这个数据进行静态修饰,被静态修饰的成员可以直接被类名调用用,静态随着类的加载而加载,而且优先于对象存在。

静态方法只能访问静态成员(静态方法和静态变量),不可以访问非静态成员,这是因为静态方法加载时,优先于对象存在,所以没有办法访问对象中的/成员。

静态方法中不能使用this和super关键字,因为this代表本类对象,super代表父类对象,而静态内容执行时,有可能因为对象内容不存在(如对象还未创建),所以thiis和super无法使用。

final关键字可用于修饰类,方法,变量(成员变量内,局部变量,静态变量),被final 修饰的类是一个最终类,不可以被继承。被final修饰的方法是一个最终终方法,不可以被覆盖,但是可以被继承。被final修饰的变量只能是一个常量,只能赋值一次。内部都类被定义在类中的局部位置上时,只能访问局部被final修饰的局部变量。
abstract关键字只能用于修饰类和方法,不能修饰变量。抽象方法只只能定义在抽象类中,抽象方法和抽象类必须由abstract修饰,抽象方法只定义方法声明,不不定义方法实现。

抽象类不可以被实例化(创建对象),只有通过子类继承抽象类并覆盖抽象类中的所有抽象方法后,该子类才可以被实例化,否则该子类还是一个抽象类。抽象类中有构造函数用于给子类对象进行初始化,同时抽象类中可

</details>

## 内部类

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识</summary>


内部类（Inner Class）是定义在另一个类也就是外部类（Outer Class）内部的类。

内部类又称为嵌套类（Nested Class），外部类又称为封闭类（Enclosing Class）。

2、内部类的分类
Java 中有四种内部类：成员内部类（Member Inner Class）
定义在外部类的成员位置上，与成员变量和方法平级。
静态内部类（Static Nested Class）
使用static关键字修饰。
局部内部类（Local Inner Class）
定义在一个类的局部位置上，例如成员方法和代码块内。
匿名内部类（Anonymous Inner Class）
没有名字的内部类，常用于简化代码。

</details>

### 成员内部类

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">特点</summary>


1.在成员内部类中能访问外部类的所有成员，包括私有的

2.在外部类中可以访问成员内部类的所有成员，包括私有的

3.成员内部类可以添加任何访问修饰符，因为它也是外部类的成员。

</details>

####   直接访问

```java
class OuterClass {
	private String outerClassField = "outer class's field~";
 
	class MemberInnerClass { // 成员内部类
		public void foo() {
			System.out.println(outerClassField); // 直接使成员名访问
		}
	}
}
```

#### 使用外部类的this引用访问

```java
class OuterClass {
	private int a;
	class MemberInnerClass { // 成员内部类
		private int a;
		public void foo() {
			System.out.println("member inner class's field: " + a);
			System.out.println("outer class's field: " + OuterClass.this.a);
		}
	}
}
//这个方法可以在外部类的成员与成员内部类的成员重名时使用。因为如果外部类成员与成员内部类成员重名，在成员内部类中直接使用这个成员的名字访问的成员是成员内部类的成员（遵循就近原则），如果想要访问外部类的这个成员，就要使用上面提到的方法。
```

```java
class OuterClass {
	class MemberInnerClass { // 成员内部类
		private String privateField = "member inner class's private field~";
		
		private void privateMethod() {
			System.out.println("member inner class's private method~");
		}
	}
	
	public void fun() {
		MemberInnerClass mic = new MemberInnerClass();
		
		mic.privateMethod(); // 外部类访问成员内部类的私有方法
 
		System.out.println(mic.privateField); // 外部类访问成员内部类的私有属性
	}
}
```

#### 在其他类中创建成员内部类的实例

```java
public class Example {
	public static void main(String[] args) {
		// 方法三
		OuterClass.MemberInnerClass mic = new OuterClass().getMemberInnerClassInstance();
	}
}
class OuterClass {
	class MemberInnerClass {
	}
	public MemberInnerClass getMemberInnerClassInstance() {
		return new MemberInnerClass();
	}
}
```

#### 补充

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">外部类的作用范围</summary>


1. 成员内部类的作用域为整个外部类类体，因为成员内部类的地位是外部类的实例成员。
1. 由于成员内部类是外部类的实例成员，所以成员内部类的实例是需要基于外部类的实例来创建的，如果外部类没有创建实例，成员内部类是不能创建实例的。
   也就是说，如果你尝试在一个静态的块中创建一个成员内部类

</details>

```java
class OuterClass {
	class MemberInnerClass {
		
	}
 
	public static void fun() {
		MemberInnerClass mic = new MemberInnerClass(); 
		// 这里会报错，因为静态函数是属于类的，
		// 而不是对象的，所以没有外部类的对象这个函数也能调用，
		// 又由于成员内部类要基于外部类的实例来创建，
		// 所以这里无法创建内部类实例
	}
}
```



### 静态内部类

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识</summary>


静态内部类是定义在一个外部类的成员位置的的类，有 static 修饰

它的地位就相当于外部类的一个静态成员

</details>

#### 直接访问

```java
class OuterClass {
	private static String outerClassField = "outer class's private field~";
 
	static class StaticNestedClass { // 静态内部类
		public void fun() {
			System.out.println(outerClassField); // 直接使用外部类的静态成员名访问这个成员
		}
	}
}
```

#### 使用外部类访问

```java
class OuterClass {
	private static String outerClassField = "outer class's private field~";
 
	static class StaticNestedClass { // 静态内部类
		public void fun() {
			System.out.println(OuterClass.outerClassField);
			// 通过外部类名加静态成员名访问这个静态成员
		}
	}
}
//这里因为是静态内部类，所以这个静态内部类是属于这个外部类整个类的，而不是属于某个外部类的实例的，所以这个静态内部类中没有外部类当前实例的 this 引用。同时，静态内部类也只能访问外部类的静态成员。

//所以这里使用的是外部类名加静态成员名来访问。
```

```java
class OuterClass {
	static class StaticNestedClass {
		private String staticNestedClassField = "static nested class's field";
	}
	
	public void fun() {
		StaticNestedClass snc = new StaticNestedClass();
 
		System.out.println(snc.staticNestedClassField);
	}
}
//
```

```java
//在其他类中创建静态内部类的实例
//在其他类中创建静态内部类的实例需要保证静态内部类的对外可见性在这个其他类中是可见的
public class Example {
	public static void main(String[] args) {
		OuterClass.StaticNestedClass snc = OuterClass.getStaticNestedClassInstance();
		
	}
}
 
class OuterClass {
	static class StaticNestedClass {
 
	}
	
	public static StaticNestedClass getStaticNestedClassInstance() {
		return new StaticNestedClass();
	}
}
```

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">总结</summary>


由于静态内部类相当于外部类的一个静态成员，所以它是属于外部类整个类的，而不是属于某个外部类实例的，

所以它不需要基于外部类的实例来进行实例化，直接使用外部类的类名就可以调用它的构造器来进行实例化。
同时，由于它不是实例成员，它的内部也不在内嵌有外部类当前实例的 this 引用。它也无法访问外部类的非静态成员。
静态内部类的作用域是外部类整个类体，因为它的地位是外部类的静态成员。

</details>

### 局部内部类

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识</summary>


局部内部类定义在方法、构造器或代码块内部，类似于方法的局部变量。它的作用域仅限于定义它的块中。

</details>

```java
class OuterClass {
	private int a = 100;
	
	public void fun() {
		class LocalInnerClass {
			private int a = 200;
			
			public void foo() {
				System.out.println("LocalInnerClass's field: " + a);
				System.out.println("outerClass's field: " + OuterClass.this.a);
			}
		}
 
	}
}
//如果局部内部类定义在一个静态的局部中（例如静态代码块和静态方法）中，则在局部内部类中就不能访问到外部类的所有非静态成员。
```

#### 外部访问内部

```java
class OuterClass {
	public void fun() {
		class LocalInnerClass {
			private String innerfield = "Hello";
		}
 
		LocalInnerClass lic = new LocalInnerClass();
		System.out.println(lic.innerfield);// 通过局部内部类的实例来访问其成员
 
	}
}
```

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">总结</summary>


由于局部内部类的地位就相当于局部变量，所以它不能添加访问修饰符，但能用 final 修饰。
局部内部类的作用域只在定义它的块中。
在局部内部类中可以访问外部类的所有成员（包括私有的），同时在外部类定义了局部内部类的块中也可以访问局部内部类的所有成员（包括私有的）。
局部内部类不能包含静态成员（静态属性、静态方法、静态代码块和静态内部类），因为静态内部类的作用域仅限于方法内部，而静态成员通常是与类本身关联的。
在 JDK 16 时，加了一个局部内部类中可以有的静态成员，就是静态属性，同时有一个限制，这个静态属性必须是 final 修饰的（这里有一个细节，static 和 final 同时使用，编译器有优化，这样这个属性就是编译时常量，不是在类加载时初始化，而是在编译时初始化。其他的静态成员依然不能在局部内部类中出现。

 </details>

### 匿名内部类

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识</summary>


匿名内部类是一种特殊的内部类，它**没有显式的类名**。匿名内部类通常用于创建一个类的实例，而这个类只需要使用一次。匿名内部类可以继承一个类或实现一个接口，并且可以在定义类的内容的同时创建对象。

</details>

### 匿名内部类类型

#### 匿名内部类实现接口

```java
interface Interface {
	void cry();
}
 
class OuterClass {
	public void method() {
		Interface cat = new Interface() {
			@Override
			public void cry() {
				System.out.println("Meow~");
			}
		};// 这里就是一个匿名内部类，
		  // 这个匿名内部类实现了Interface接口，
		  // 定义了类的结构后就被实例化了
 
		cat.cry();
	}
}
```

#### 匿名内部类继承抽象类

```java
abstract class Animal {
	private String name;
 
	public Animal(String name) {
		this.name = name;
	}
 
	abstract void cry();
}
 
class OuterClass {
	public void method() {
		Animal cat = new Animal("cat") {
			@Override
			public void cry() {
				System.out.println("Meow~");
			}
		};// 这里就是一个匿名内部类，
		  // 这个匿名内部类继承了抽象类Animal，然后实现了抽象类的抽象方法，
		  // 定义了类的结构后就被实例化了
 
		cat.cry();
	}
}
```

### 特点

#### 匿名内部类的类名

匿名内部类只是没有显式的类名，但实际上有隐式的名字，一般命名规则是 `外部类名$1` ，这里的 1 是指在这个外部类内定义的第一个匿名内部类，我们可以通过 getClass() 方法获取类名：

```java
public class Example {
	public static void main(String[] args) {
		new OuterClass().method();
	}
}
 
interface Interface {
 
}
 
class OuterClass$1 {
 
}
 
class OuterClass {
	public void method() {
		Interface i = new Interface() {
			// 匿名内部类
		};
 
		System.out.println(i.getClass());
	}
}
```

#### 内部访问外部

##### 直接访问

```java
abstract class Animal {
    abstract void foo();
}
 
class OuterClass {
	private String outerField = "outer class private field~";
 
	public void fun() {
		Animal cat = new Animal() {
            @Override
			public void foo() {
				System.out.println(outerField);// 直接访问
			}
		};
		
	}
}
```

##### 通过外部this引用访问

```java
abstract class Animal {
    abstract void foo();
}
 
class OuterClass {
	private String outerField = "outer class private field~";
 
	public void fun() {
		Animal cat = new Animal() {
            @Override
			public void foo() {
				System.out.println(OuterClass.this.outerField);// 通过外部类的this引用访问
			}
		};
 
	}
}
//如果匿名内部类定义在一个静态的局部中（例如静态代码块和静态方法）中，则在匿名内部类中就不能访问到外部类的所有非静态成员
```

#### 在外部类定义匿名内部类的块中访问匿名内部类的成员

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">初识</summary>


由于匿名内部类的类名不是显式的，所以我们只能使用匿名内部类的父类或者其实现接口类型的引用来指向匿名内部类的对象，这就导致我们只能访问到匿名内部类的父类或者其实现接口中有的成员。对于匿名内部类中的所有特有成员，外界都是不能直接访问到的，因为我们没法将这个匿名内部类的引用向下转型，所以就没有办法访问子类（匿名内部类）的特有成员。

所以我们实际上不能直接访问到匿名内部类的成员，只有匿名内部类重写了父类或者接口的默认方法，或者匿名内部类实现了接口的抽象方法，这样就可以通过动态绑定实现调用匿名内部类的方法。但也仅限于调用方法，因为对于属性是静态绑定的，

所以匿名内部类中的所有属性外界都是不能直接访问的（这与上面说的匿名内部类的所有特有成员外界都不能访问一致）

</details>

```java
interface Interface {
	int interfaceField = 100;
	void cry();
}
 
class OuterClass {
	public void fun() {
		Interface cat = new Interface() {
			@Override
			public void cry() {
				System.out.println("Meow~");
			}
			
			public String anonymousClassField = "anonymous class's specific field~";
			public void anonymousClassMethod() {
				System.out.println("anonymous class's specific method~");
			}
		};
 
		cat.cry(); // 可以直接访问匿名内部类重写的方法，通过动态绑定机制
 
		System.out.println(cat.interfaceField); // 可以访问接口中的字段，因为引用是接口类型的
 
		// cat.anonymousClassMethod(); // 没法访问匿名内部类的特有方法
		
		// System.out.println(cat.anonymousClassField); // 没法访问匿名内部类的特有属性
	}
}
```

#### 使用匿名内部类的实例访问其成员的语法

```java
abstract class Animal {
	abstract void cry();
}
 //这种方式只能访问一次匿名内部类的实例的成员，然后这个实例就不能访问到了，也就被垃圾回收机制回收了。
class OuterClass {
	public void fun() {
		new Animal() {
			@Override
			void cry() {
				System.out.println("Meow~");
			}
		}.cry();// 创建对象之后立马调用，
				// 这种方式适用于创建实例后只使用一次这个实例的情形
				// 这中情况，前面不能使用Animal类型的引用来接受了，
				// 因为这样就是相当于调用了一个cry方法
				// 返回值是void
	}
}
```

#### 匿名内部类访问定义它的块中的局部变量

```java
interface Interface {
	void cry();
}
 
class OuterClass {
	public void fun() {
		final int finalLocalVar = 0;
		int neverChangedVar = 0;
		// neverChangedVar = 1;
		// 这里如果有这一个语句的话，后面就会报错，因为这样这个局部变量就不是隐式final的了
		Interface cat = new Interface() {
			@Override
			public void cry() {
				System.out.println(finalLocalVar);
				System.out.println(neverChangedVar);
			}
		};
 
	}
}
```

```java
interface Interface {
	void cry();
}
 
class OuterClass {
	public void fun(final int finalParameter, int neverChangedParameter) {
		// neverChangedParameter = 0;
		// 这里如果有这一句的话，也会报错，因为这样这个参数就不是隐式final的了
		Interface cat = new Interface() {
			@Override
			public void cry() {
				System.out.println(finalParameter);
				System.out.println(neverChangedParameter);
			}
		};
 
	}
}
```

### 最佳实践

```java
public class Example {
	public static void animalCry(Cry c) {
		c.cry();
	}
 
	public static void main(String[] args) {
		animalCry(new Cry() { // 直接创建一个匿名内部类的实例，同时作为参数传给这个方法
			@Override
			public void cry() {
				System.out.println("Meow~");
			}
		});
	}
}
 
interface Cry {
	void cry();
}
```

```java
public abstract class Animal{ 
public abstract void eat();
}//抽象类

public interface swim{
public abstractvoid swim(); }

public static void main(String[] args) {
// 匿名内部类实现 接口整体看为对象 接口多态
swim s=new swim(){//父类swim接口=子类匿名内部类
@override 2个用法
public void swim()};//去接收对象
S.swim
{System.out.println("匿名内部类");}
//调用方法
//编译看左边,运行看右边的原则
new swim(
@override 2个用法
public void swim(){System.out.println("匿名内部类");}
}.swim()
匿名内部类继承抽象类
method(new Animal(){
@Override
public void eat() {
System.out.println("动物吃东西");
```



















