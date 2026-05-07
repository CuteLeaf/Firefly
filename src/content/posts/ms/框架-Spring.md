---
title: Spring
published: 2025-01-01
description: 汇总 Spring 框架面试题，重点讲解 Bean 完整生命周期、各阶段 Aware 接口及初始化销毁回调机制。
tags: [框架,JAVA, Spring, 技术]
category: 面试
draft: false
---

# Bean生命周期
1. 实例化：为 Bean 分配内存空间；
2. 设置属性：将当前类依赖的 Bean 属性，进行注入和装配；
3. 初始化：
    1. 执行各种通知；感知容器，前面设置属性没设置好的可以在这里搞，然后通过一些例如ApplicationContext.getBean获取bean
    2. 执行初始化的前置方法；
    3. 执行初始化方法；如连接池、文件流、缓存
    4. 执行初始化的后置方法。
4. 使用 Bean：在程序中使用 Bean 对象；
5. 销毁 Bean：将 Bean 对象进行销毁操作。

| 接口 / 注解                               | 阶段     | 作用                           |
| ------------------------------------- | ------ | ---------------------------- |
| `BeanNameAware`                       | Aware  | 获取 Bean 名称                   |
| `BeanFactoryAware`                    | Aware  | 获取 BeanFactory 引用            |
| `ApplicationContextAware`             | Aware  | 获取 ApplicationContext        |
| `InitializingBean` / `@PostConstruct` | 初始化    | 属性注入后执行初始化逻辑                 |
| `DisposableBean` / `@PreDestroy`      | 销毁     | 容器关闭前释放资源                    |
| `BeanPostProcessor`                   | 前后置处理  | 创建代理、注入增强逻辑                  |
| `BeanFactoryPostProcessor`            | 容器启动早期 | 修改 BeanDefinition 或动态注册 Bean |


![](./image/框架-Spring.assets/框架-Spring-20260104174011.png)

## 初始化
1. PostConstruct
2. InitializingBean
3. init-method
通常作用于
	数据预热与缓存加载
	静态常量初始化、初始化字典到缓存
	资源连接初始化
	定时任务启动

| 特性          | @PostConstruct | InitializingBean | init-method |
| ----------- | -------------- | ---------------- | ----------- |
| ​**耦合度**​   | 低（JSR-250标准）   | 高（Spring接口）      | 无（纯配置）      |
| ​**执行顺序**​  | 最早             | 中间               | 最晚          |
| ​**代码侵入性**​ | 低（仅需注解）        | 高（需实现接口）         | 无（无需修改代码）   |
| ​**多方法支持**​ | 否              | 否                | 否           |
| ​**适用场景**​  | 大多数推荐场景        | 需要与Spring深度集成    | 第三方库初始化     |

# 循环依赖
- A对象先从一二三级缓存查询有没有缓存
- 没有->创建对象，用反射把A创建出来，包装成ObjectFactory放到3级缓存内
- 完成->填充属性，而A对象包含B对象
	- 开始创建B对象->从缓存一二三中查询有没有缓存
	- 没有->创建对象，用反射把B创建出来，包装成ObjectFactory放到3级缓存内
	- 完成->填充属性，而B又包含A对象
		- A对象先从一二三级缓存查询，查询到3级缓存中有
		- 有个判断从三级缓存是否拿到A，拿到的话会把他放到二级缓存中，删除三级缓存
		- 此时完成了B对象的填充属性
	- 初始化
	- 缓存转移，将B的对象放到一级缓存中，删除在二三的缓存
	- 完成B对象创建
- 初始化
- 缓存转移，将A的对象放到一级缓存中，删除在二三的缓存
- 完成A对象创建

![|492x338](./image/框架-Spring.assets/框架-Spring-20260104174318.png)

# AOP
AOP称为面向切面编程，抽取公共模块复用
使用场景
- 缓存处理
- 记录操作日志
	使用aop中的环绕通知+切面表达式，通过环绕通知的参数获取请求方法的参数
- Spring事务处理

# 事务失效场景
- 代码
	- 没有走代理，比如this调用、修饰符
	- 异常未被捕获抛出或异常类型不匹配
- 配置
	- 配置错误，事务传播机制、事务时间、注解配置了只读却进行写操作
	- 数据源未配置事务管理或未开启自动代理
- 环境
	- 多线程调用，父线程插入事务，子线程又独立事务
	- 数据库表不支持事务
# Bean线程安全
不是线程安全的
有一个Scope注解，默认值是singleton单例
- 一般在spring的bean的中都是注入无状态的对象，没有线程安全问题
- 如果在bean中定义了可修改的成员变量，是要考虑线程安全问题的，可以使用多例或者加锁来解决


