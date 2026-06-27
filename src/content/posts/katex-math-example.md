---
title: KaTeX 数学公式示例
published: 1970-01-02
description: 展示 Firefly 主题对 KaTeX 数学公式的支持，包括行内公式、块级公式和复杂数学符号。
tags: [KaTeX, Math, 示例]
category: 文章示例
draft: false
image: api
---

本文展示了 [Firefly](https://github.com/CuteLeaf/Firefly) 主题对 KaTeX 数学公式的渲染支持。

## 行内公式 (Inline)

行内公式使用单个 `$` 符号包裹。

例如：欧拉公式 $e^{i\pi} + 1 = 0$ 是数学中最优美的公式之一。

质能方程 $E = mc^2$ 也是家喻户晓。

## 块级公式 (Block)

块级公式使用两个 `$$` 符号包裹，会居中显示。

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

## 复杂示例

### 矩阵 (Matrices)

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
\alpha & \beta \\
\gamma & \delta
\end{pmatrix} =
\begin{pmatrix}
a\alpha + b\gamma & a\beta + b\delta \\
c\alpha + d\gamma & c\beta + d\delta
\end{pmatrix}
$$

### 极限与求和 (Limits and Sums)

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$

### 麦克斯韦方程组 (Maxwell's Equations)

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\varepsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

### 化学方程式 (Chemical Equations)

$$
\ce{CH4 + 2O2 -> CO2 + 2H2O}
$$

## 更多符号

| 符号 | 代码 | 渲染结果 |
| :--- | :--- | :--- |
| Alpha | `\alpha` | $\alpha$ |
| Beta | `\beta` | $\beta$ |
| Gamma | `\Gamma` | $\Gamma$ |
| Pi | `\pi` | $\pi$ |
| Infinity | `\infty` | $\infty$ |
| Right Arrow | `\rightarrow` | $\rightarrow$ |
| Partial | `\partial` | $\partial$ |

更多 KaTeX 语法请参考 [KaTeX Supported Functions](https://katex.org/docs/supported.html)。
