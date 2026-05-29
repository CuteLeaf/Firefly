---
title: AutoCAD模型空间的图形如何在布局视口中居中对齐
published: 2026-04-08
description: 很多时候我们需要AutoCAD模型空间的图形在布局视口中居中对齐，以方便排版打印。
tags: [CAD布局, CAD打印]
category: 技术文档
draft: false
image: "https://cdn.jimuhaoke.com/2025/CAD%E4%B8%89%E7%BB%B4%E5%BB%BA%E6%A8%A1%E8%AF%BE%E7%A8%8B.webp"
---
### 问题描述：

这个问题的问法很多，比如：

CAD模型空间图框怎么和布局空间图框重合？

CAD模型空间的图形如何在布局视口中居中对齐？

CAD模型图框如何与布局一致？ 等等，这都是一个意思。

### 解决办法：

首先在模型空间绘制好图形，

一般都是有边框或者直接使用图框，

总之是有定位的图形可以后期定位，

比如下面的图形就是使用选中的这个虚线的矩形作为定位，

矩形大小都是设定好的未来视口的大小。

接下来在布局中创建相同比例关系的视口，
或者直接使用对应的图框：

![布局视口中居中对齐](https://cdn.jimuhaoke.com/2025/%E5%B8%83%E5%B1%80%E8%A7%86%E5%8F%A3%E4%B8%AD%E5%B1%85%E4%B8%AD%E5%AF%B9%E9%BD%90%20(1).webp)

布局视口中居中对齐

上图可以看到，图框在外侧，内部创建了视口，
但是里面的图形还没有对齐，接下来开始对齐。
1、双击视口进入视口编辑状态。
2、输入zoom（z）缩放命令，选择窗口缩放（不选择也可以）。
3、按住shift+鼠标右单击选择临时对象捕捉的端点，
这一步必须手动开启临时对象捕捉，
默认开的自动捕捉在此时不起作用，
这也许是个bug。
操作两次分别捕捉定位矩形的两个角点：

![布局视口中居中对齐](https://cdn.jimuhaoke.com/2025/%E5%B8%83%E5%B1%80%E8%A7%86%E5%8F%A3%E4%B8%AD%E5%B1%85%E4%B8%AD%E5%AF%B9%E9%BD%90%20(2).webp)

布局视口中居中对齐

### 感谢学员：

感谢VIP学员王德州的反馈，如果临时对象捕捉不起作用，则需要打开下面的开关。

op-用户系统配置-坐标数据输入的优先级：执行对象捕捉

### 相关学习：

AutoCAD二维制图课程：

[https://jimuhaoke.com/blog/autocad-2d-drafting-course](https://jimuhaoke.com/blog/autocad-2d-drafting-course)

AutoCAD三维建模课程：

[https://jimuhaoke.com/blog/autocad-3d-modeling-course](https://jimuhaoke.com/blog/autocad-3d-modeling-course)

AutoCAD高级渲染课程：

[https://jimuhaoke.com/blog/autocad-advanced-rendering-course](https://jimuhaoke.com/blog/autocad-advanced-rendering-course)