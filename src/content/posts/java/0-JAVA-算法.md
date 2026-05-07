---
title: 算法
published: 2025-01-01
description: 介绍递归的基本概念与重要规则，包含冒泡排序的 Java 实现及版本号判断等算法示例，帮助理解基础算法思想。
tags:
  - 算法
  - 技术
  - 基础
category: JAVA
draft: false
---

## 递归

### 基本介绍

自己调用自己，每次调用时传入不同的变量

### 重要规则

1.执行一个方法时，就创建一个新的受保护的独立空间（栈空间）

2.方法的局部变量是独立的，不会项目影响，比如变量n

3.如果方法中使用的应用类型变量，就会共享该引用类型的数据

4.递归必须向退出递归的条件逼近，否则就会StackOverflowError报错

5.当方法执行完毕，或者遇到return，就会返回

### 案例

```java
public void test(int n){
	if(n>2){
		test(n-1); 
	}
}
```

# 排序

## 冒泡排序

### 案例

```java
public class BubbleSort {

    /*
     * 冒泡排序
     *
     * 参数说明: 
     *     a -- 待排序的数组
     *     n -- 数组的长度
     */
    public static void bubbleSort1(int[] a, int n) {
        int i,j;

        for (i=n-1; i>0; i--) {
            // 将a[0...i]中最大的数据放在末尾
            for (j=0; j<i; j++) {

                if (a[j] > a[j+1]) {
                    // 交换a[j]和a[j+1]
                    int tmp = a[j];
                    a[j] = a[j+1];
                    a[j+1] = tmp;
                }
            }
        }
    }

    /*
     * 冒泡排序(改进版)
     *
     * 参数说明: 
     *     a -- 待排序的数组
     *     n -- 数组的长度
     */
    public static void bubbleSort2(int[] a, int n) {
        int i,j;
        int flag;                 // 标记

        for (i=n-1; i>0; i--) {

            flag = 0;            // 初始化标记为0
            // 将a[0...i]中最大的数据放在末尾
            for (j=0; j<i; j++) {
                if (a[j] > a[j+1]) {
                    // 交换a[j]和a[j+1]
                    int tmp = a[j];
                    a[j] = a[j+1];
                    a[j+1] = tmp;

                    flag = 1;    // 若发生交换，则设标记为1
                }
            }

            if (flag==0)
                break;            // 若没发生交换，则说明数列已有序。
        }
    }

    public static void main(String[] args) {
        int i;
        int[] a = {20,40,30,10,60,50};

        System.out.printf("before sort:");
        for (i=0; i<a.length; i++)
            System.out.printf("%d ", a[i]);
        System.out.printf("\n");

        bubbleSort1(a, a.length);
        //bubbleSort2(a, a.length);

        System.out.printf("after  sort:");
        for (i=0; i<a.length; i++)
            System.out.printf("%d ", a[i]);
        System.out.printf("\n");
    }
}
```



# 项目
## 判断是否连续
利用**等差数列求和公式**做数学判定，无需遍历区间：
1. 去重后，若版本号是「连续无断层」的整数序列，则满足：
    总和最小值最大值元素个数
2. 若实际总和 ≠ 公式计算的总和 → 存在断层；
3. 重复版本号可通过「原始列表大小 - 去重后大小 > 0」快速判定（无需具体找重复值）。
```java
import java.util.*;

/**
 * 等差数列求和校验法：极致简洁，快速判定是否连续/重复
 * 时间复杂度：O(n)，空间复杂度：O(n)（仅去重）
 */
public class MathSumVersionValidator {

    public static SimpleCheckResult quickValidate(List<Integer> versionList) {
        if (versionList == null || versionList.isEmpty()) {
            return new SimpleCheckResult(false, false, false);
        }

        // 1. 去重，获取核心参数
        Set<Integer> unique = new HashSet<>(versionList);
        boolean hasDuplicate = versionList.size() > unique.size(); // 快速判定是否有重复
        if (unique.size() == 1) { // 只有1个版本号，必然连续
            return new SimpleCheckResult(true, hasDuplicate, true);
        }

        // 2. 找极值 + 计算总和
        int min = Collections.min(unique);
        int max = Collections.max(unique);
        long expectedSum = (long) (min + max) * unique.size() / 2; // 等差数列求和（防溢出用long）
        long actualSum = unique.stream().mapToLong(Integer::longValue).sum();

        // 3. 判定是否连续
        boolean isContinuous = expectedSum == actualSum;

        return new SimpleCheckResult(true, hasDuplicate, isContinuous);
    }

    // 极简结果封装：仅返回核心判定结果
    public static class SimpleCheckResult {
        private final boolean isValid; // 数据有效
        private final boolean hasDuplicate; // 是否有重复
        private final boolean isContinuous; // 是否连续

        public SimpleCheckResult(boolean isValid, boolean hasDuplicate, boolean isContinuous) {
            this.isValid = isValid;
            this.hasDuplicate = hasDuplicate;
            this.isContinuous = isContinuous;
        }

        @Override
        public String toString() {
            return "数学求和校验法（极简）结果：\n" +
                    "1. 是否有重复版本号：" + (hasDuplicate ? "是" : "否") + "\n" +
                    "2. 是否连续无断层：" + (isContinuous ? "是" : "否");
        }
    }

    // 测试
    public static void main(String[] args) {
        List<Integer> list1 = Arrays.asList(1,2,2,4,5); // 重复+断层
        List<Integer> list2 = Arrays.asList(1,2,3,4); // 无重复+连续
        System.out.println(quickValidate(list1));
        System.out.println("---");
        System.out.println(quickValidate(list2));
    }
}
```