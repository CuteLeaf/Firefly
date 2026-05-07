---
title: Spring-MyBatis
published: 2025-01-01
description: 整理 MyBatis 面试核心知识，涵盖执行流程、Executor 执行器、延迟加载原理及输入输出参数映射机制。
tags: [框架,JAVA, Spring-MyBatis, 技术]
category: 面试
draft: false
---

# 工作原理&执行流程
![|492x553](./image/框架-Spring-MyBatis.assets/框架-Spring-MyBatis-20260104215117.png)
1. **读取MyBatis的配置文件**：mybatis-config.xml为MyBatis的全局配置文件，用于配置数据库连接信息，现在都用yml配置了
2. **构造会话工厂**：通过MyBatis的环境配置信息构建会话工厂SQLsessionFactory。
3. **创建会话对象**：由工厂创建SqlSession对象，该对象中包含了执行SQL语句的所有方法
4. **Executor执行器**：操作数据库的接口，同时负责缓存维护，现在都用yml配置了
5. **MappedStatement对象**：在Executor接口的执行方法中有一个MappedStatement类型的参数，该参数是对映射信息的封装，用于存储要映射的SQL语句的id、参数等信息。
6. **输入参数映射**：转换类型将输入的参数转换为数据库的
7. **输出结果映射**：SQL输出的类型转换成java的
MappedStatement对象：
 ![](./image/框架-Spring-MyBatis.assets/框架-Spring-MyBatis-20260104215755.png)

# 延迟加载
- 需要用到数据时候才加载
- 可以在配置文件中配置lazyLoadingEnabled=true|false，默认关闭
- 底层
	主要用到了CGLIB创建目标的代理对象
	当调用方法时候进入拦截器invoke方法的，如果发现目标方法是null值，则执行SQL
	获取数据后，调用set方法设置属性值，再继续查询目标方法，

# 一级二级缓存
- 一级缓存：基于PerpetualCache的HashMap本地缓存，其存储作用域为Session，当Session进行flush或close之后，该Session中的所有Cache就将清空，默认打开一级缓存
- 二级缓存是基于namespace和mapper的作用域起作用的，不是依赖于SQLsession，默认也是采用PerpetualCache，HashMap存储。需要单独开启，一个是核心配置，一个是mapper映射文件
# 什么时候清理缓存数据
 当某一个作用域（一级缓存Session/二级缓存Namespaces)的进行了新增、修改、删除操作后，默认该作用域下所有select中的缓存将被clear。




