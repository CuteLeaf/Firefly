---
title: Spring-Boot
published: 2025-01-01
description: 总结 Spring Boot 面试核心考点，深入剖析自动配置原理、@SpringBootApplication 注解及条件注解加载机制。
tags: [框架,JAVA,Spring-Boot, 技术]
category: 面试
draft: false
---

# 自动配置原理
- @SpringBootConfiguration
- @EnableAutoConfiguration
- @ComponentScan

| 子注解                        | 核心作用                                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| `@Configuration`           | 标记入口类为 Spring 配置类，允许在类中通过 `@Bean` 定义自定义 Bean；                                                         |
| `@EnableAutoConfiguration` | 开启 Spring Boot 自动配置机制，根据项目依赖（如 `spring-boot-starter-web`）自动加载对应的配置类（如 Tomcat、MVC 配置），无需手动编写 XML/注解配置； |
| `@ComponentScan`           | 开启组件扫描，默认扫描**入口类所在包及所有子包**下的 `@Component/@Controller/@Service/@Repository` 等注解类，自动注册为 Spring Bean；    |

1. 启动 SpringBoot 应用，`@SpringBootApplication`注解触发自动配置机制。
2. `@EnableAutoConfiguration`通过注解`@Import` 导入对应的选择器，内部读取了该项目和该项目的引用jar包的classpath路径下的 `META-INF/spring.factories`下的自动配置类全类名。
3. 在这些配置类中，根据条件注解定义的条件来决定哪些BEAN需要导入到spring容器中。

![](./image/框架-Spring-Boot.assets/框架-Spring-Boot-20260104205730.png)







# 执行流程
#### 1. 启动入口
这个入口主要做了以下几件事情：
1. **创建 SpringApplication 实例**：初始化 Spring Boot 环境。
2. **初始化环境和监听器**：设置启动的 `Environment`，并且添加 `ApplicationListener` 监听器。
3. **准备和刷新 Spring 上下文**：通过 `prepareContext` 和 `refreshContext` 方法进行上下文环境的准备和刷新。
#### 2. 创建 SpringApplication 实例

在 `SpringApplication` 的构造方法中，Spring Boot 解析应用的启动模式（例如是 Web 应用、Servlet 应用或是普通应用），并初始化应用的上下文类型。Spring Boot 的不同上下文类型包括 `AnnotationConfigApplicationContext`（非 Web 应用）和 `AnnotationConfigServletWebServerApplicationContext`（Web 应用）。

#### 3. 初始化 Environment 和监听器

接下来，Spring Boot 会初始化 `ConfigurableEnvironment`，这个环境中包含了系统的属性、环境变量、配置文件等数据，作为后续加载 Bean 定义和初始化的基础。

同时，Spring Boot 也会初始化一系列的 `ApplicationListener`，用于监听和处理应用启动过程中的事件，比如 `ApplicationEnvironmentPreparedEvent`、`ApplicationPreparedEvent` 等。

#### 4. 加载配置类并触发自动配置

Spring Boot 使用 `@EnableAutoConfiguration` 注解触发自动配置，核心实现是在 `AutoConfigurationImportSelector` 中加载 `META-INF/spring.factories` 配置文件，文件中列出了许多自动配置类（如 `DataSourceAutoConfiguration`、`JpaRepositoriesAutoConfiguration` 等），根据条件（例如某些 Bean 是否存在、某些属性是否被配置等）加载相应的自动配置。

#### 5. 加载并注册 Bean

在 `refreshContext()` 方法中，Spring Boot 调用 `refresh()` 方法，这一步骤中完成了 BeanFactory 的初始化和 `BeanPostProcessor` 的注册，并解析 `@Component`、`@Service`、`@Repository` 等注解标注的 Bean 定义，将它们注册到 `BeanFactory` 中。

在源码层面，`refresh()` 方法中，`invokeBeanFactoryPostProcessors` 和 `registerBeanPostProcessors` 这两个方法是关键，分别用于执行所有 `BeanFactoryPostProcessor` 和 `BeanPostProcessor`，确保 Bean 的生命周期正确管理。

#### 6. Web 环境中的嵌入式容器启动

在 Web 应用中，Spring Boot 会启动嵌入式 Web 容器（如 Tomcat 或 Jetty）。Spring Boot 默认通过 `ServletWebServerApplicationContext` 启动内嵌的 Web 服务器。在 `refresh()` 的最后，会启动嵌入式容器，将应用作为 Web 应用发布。

#### 7. 执行 ApplicationRunner 和 CommandLineRunner

Spring Boot 启动完成后，会扫描并执行所有实现了 `ApplicationRunner` 和 `CommandLineRunner` 接口的 Bean。它们可以用于在启动后执行自定义逻辑。

#### 8. 发布应用启动完成事件

最后，Spring Boot 发布 `ApplicationReadyEvent` 事件，通知所有监听器应用已启动完成。至此，Spring Boot 应用正式启动完成，可以接收 HTTP 请求或执行其他任务。