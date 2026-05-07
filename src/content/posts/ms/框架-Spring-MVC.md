---
title: Spring-MVC
published: 2025-01-01
description: 总结 Spring MVC 面试考点，详解 DispatcherServlet 执行流程、处理器映射器、适配器及视图解析器工作原理。
tags: [框架,JAVA, Spring-MVC, 技术]
category: 面试
draft: false
---

# 执行流程
## jsp版本
- 前端控制器（DispatcherServlet）
	接受请求，响应结构，转发
- 处理器映射器（HandlerMapping）
	根据你的url找到你的Java方法，例如：配置文件方式，实现接口方式，注解方式
- 处理器适配器（HandlerAdapter）
	说人话就是前面的组件定位到具体Java方法后，用来执行Java方法的组件
- 视图解析器（ViewResolver）
	对controller生成的值进行解析，给你的渲染视图用的
![](./image/框架-Spring-MVC.assets/框架-Spring-MVC-20260104201129.png)

## 目前版本
1. 用户发送出请求到前端控制器DispatcherServlet
2. DispatcherServlet收到请求调用HandlerMapping（处理器映射器）
3. HandlerMapping找到具体的处理器，生成处理器对象及处理器拦截器（如果有），再一起返回给DispatcherServlet。
4. DispatcherServlet调用HandlerAdapter（处理器适配器）
5. HandlerAdapter经过适配调用具体的处理器（Handler/Controller）
6. 方法上添加了@ResponseBody
7. 通过HttpMessageConverter来返回结果转换为JSON并响应
![](./image/框架-Spring-MVC.assets/框架-Spring-MVC-20260104202546.png)