---
title: 微积分线性代数复习笔记
published: 2026-06-21
description: 大学微积分和线性代数课程的复习笔记，主要放一下些公式和方法在这里
image: ./covers/cover13.webp
tags: [复习笔记, Java, 软件开发]
category: 复习笔记
draft: false
---

# 微积分

## 一、曲线曲面积分

### 1.第一类曲线积分（对弧长的曲线积分）

#### 计算公式（三种参数形式）
##### (1) 直角坐标 $L:y=\varphi(x),\ a\le x\le b$ 
$$ds = \sqrt{1+(y')^2}dx,\quad \int_L f(x,y)ds = \int_a^b f(x,\varphi(x))\sqrt{1+(\varphi'(x))^2}dx$$
 
##### (2) 参数方程 $L:\begin{cases}x=x(t)\\y=y(t)\end{cases},\ \alpha\le t\le\beta$
$$ds=\sqrt{(x'(t))^2+(y'(t))^2}dt,\quad \int_L fds=\int_\alpha^\beta f(x(t),y(t))\sqrt{x'^2+y'^2}dt$$
> 注意：下限$\alpha$ 必须小于上限$\beta$，和走向无关

##### (3) 极坐标 $r=r(\theta),\ \alpha\le\theta\le\beta$
$$ds=\sqrt{r^2(\theta)+r'^2(\theta)}d\theta,\quad \int_L fds=\int_\alpha^\beta f(r\cos\theta,r\sin\theta)\sqrt{r^2+r'^2}d\theta$$

##### (4) 空间曲线 $\Gamma:\begin{cases}x=x(t)\\y=y(t)\\z=z(t)\end{cases},\alpha\le t\le\beta$
$$ds=\sqrt{x'^2(t)+y'^2(t)+z'^2(t)}dt,\quad \int_\Gamma f(x,y,z)ds=\int_\alpha^\beta f(x(t),y(t),z(t))\sqrt{x'^2+y'^2+z'^2}dt$$

##### 具有偶倍奇零的对称性质

---

### 2.第二类曲线积分（对坐标的曲线积分）

向量场 $\vec{F}=P(x,y)\vec{i}+Q(x,y)\vec{j}$
$$\int_L \vec{F}\cdot d\vec{r} = \int_L Pdx+Qdy = \lim_{\lambda\to0}\sum P_i\Delta x_i+Q_i\Delta y_i$$

物理：变力沿曲线做功；**有方向**：$\displaystyle\int_{L^-}Pdx+Qdy = -\int_L Pdx+Qdy$

#### (1) 参数直接计算
$L:\begin{cases}x=x(t)\\y=y(t)\end{cases}$，起点$t=\alpha$，终点$t=\beta$（上下限和起终点对应，不分大小）
$$\int_L Pdx+Qdy=\int_\alpha^\beta \Big[P(x(t),y(t))x'(t)+Q(x(t),y(t))y'(t)\Big]dt$$

空间曲线 $\Gamma$：$\displaystyle\int_\Gamma Pdx+Qdy+Rdz=\int_\alpha^\beta \big[Px'+Qy'+Rz'\big]dt$

#### (2) 格林公式（平面闭曲线）
$L$ 是**正向**分段光滑闭曲线，$D$ 是$L$ 围成区域，$P,Q$ 在$D$ 一阶连续偏导：
$$\oint_L Pdx+Qdy = \iint_D \left(\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}\right)dxdy$$

正向规定：逆时针旋转为正；负向加负号。

#### (3) 格林公式两大推论
1. 平面区域面积：$A=\displaystyle\iint_D dxdy=\frac12\oint_L xdy-ydx$
2. 曲线积分与路径无关充要条件（$D$ 单连通）：
$$\frac{\partial Q}{\partial x}\equiv \frac{\partial P}{\partial y}$$
此时存在原函数 $u(x,y)$，满足 $du=Pdx+Qdy$，且
$$\int_{A(x_1,y_1)}^{B(x_2,y_2)} Pdx+Qdy = u(B)-u(A)$$

#### (4) 空间第二类曲线积分：斯托克斯公式
$\Gamma$ 空间分段光滑闭曲线，$\Sigma$ 是以$\Gamma$ 为边界的分片光滑曲面，$\Gamma$ 正向与$\Sigma$ 法向量成右手螺旋：
$$\oint_\Gamma Pdx+Qdy+Rdz
=\iint_\Sigma
\begin{vmatrix}
dydz & dzdx & dxdy \\
\frac{\partial}{\partial x} & \frac{\partial}{\partial y} & \frac{\partial}{\partial z} \\
P & Q & R
\end{vmatrix}
=\iint_\Sigma \left(\frac{\partial R}{\partial y}-\frac{\partial Q}{\partial z}\right)dydz
+\left(\frac{\partial P}{\partial z}-\frac{\partial R}{\partial x}\right)dzdx
+\left(\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}\right)dxdy$$
旋度简写：$\displaystyle\oint_\Gamma \vec{F}\cdot d\vec{r} = \iint_\Sigma (\nabla\times\vec{F})\cdot d\vec{S}$

---

### 3.第一类曲面积分（对面积的曲面积分）

#### 计算公式
##### (1) $\Sigma:z=z(x,y)$，投影$D_{xy}$ 在$xy$面
$$dS = \sqrt{1+\left(\frac{\partial z}{\partial x}\right)^2+\left(\frac{\partial z}{\partial y}\right)^2}dxdy$$
$$\iint_\Sigma f(x,y,z)dS = \iint_{D_{xy}} f(x,y,z(x,y))\sqrt{1+z_x^2+z_y^2}dxdy$$

#### (2) $\Sigma:x=x(y,z)$ 投影$D_{yz}$
$$dS=\sqrt{1+x_y^2+x_z^2}dydz$$

#### (3) $\Sigma:y=y(x,z)$ 投影$D_{xz}$
$$dS=\sqrt{1+y_x^2+y_z^2}dzdx$$

#### 具有偶倍奇零的对称性质

---

### 4.第二类曲面积分（对坐标的曲面积分）
#### (1) 定义与向量形式
有向曲面$\Sigma$，单位法向量$\vec{n}=(\cos\alpha,\cos\beta,\cos\gamma)$，向量场$\vec{F}=P\vec{i}+Q\vec{j}+R\vec{k}$
$$\iint_\Sigma \vec{F}\cdot d\vec{S} = \iint_\Sigma P dydz + Q dzdx + R dxdy$$
$d\vec{S}=\vec{n}dS$，曲面有侧（上/下、前/后、左/右），反向积分变号：$\displaystyle\iint_{\Sigma^-}\vec{F}\cdot d\vec{S}=-\iint_\Sigma\vec{F}\cdot d\vec{S}$

#### (2) 分投影计算法
1. $\displaystyle\iint_\Sigma R dxdy$：只投影$xOy$面，上侧取$+$，下侧取$-$
$$\iint_\Sigma R dxdy = \pm \iint_{D_{xy}} R(x,y,z(x,y))dxdy$$
2. $\displaystyle\iint_\Sigma P dydz$：投影$yOz$，前侧$+$，后侧$-$
3. $\displaystyle\iint_\Sigma Q dzdx$：投影$xOz$，右侧$+$，左侧$-$

#### (3) 两类曲面积分转换关系
$$
\begin{cases}
dydz=\cos\alpha \,dS\\
dzdx=\cos\beta \,dS\\
dxdy=\cos\gamma \,dS
\end{cases}
\quad\Rightarrow\quad
\iint_\Sigma P dydz+Q dzdx+R dxdy
=\iint_\Sigma (P\cos\alpha+Q\cos\beta+R\cos\gamma)dS
$$

#### (4) 高斯公式（闭合曲面核心）
$\Sigma$ 是空间闭区域$\Omega$ 的**外侧**分片光滑闭曲面，$P,Q,R$ 在$\Omega$ 一阶连续偏导：
$$\oiint_\Sigma P dydz+Q dzdx+R dxdy
=\iiint_\Omega \left(\frac{\partial P}{\partial x}+\frac{\partial Q}{\partial y}+\frac{\partial R}{\partial z}\right)dV$$
散度简写：$\displaystyle\oiint_\Sigma \vec{F}\cdot d\vec{S} = \iiint_\Omega (\nabla\cdot\vec{F})dV$
内侧闭合曲面等式右侧加负号。

#### 推论：空间立体体积
$$V=\iiint_\Omega dV = \frac13\oiint_\Sigma xdydz+ydzdx+zdxdy$$

---

### 5. 梯度/散度/旋度
设 $\vec{F}=P\vec{i}+Q\vec{j}+R\vec{k},\ u=u(x,y,z)$
1. 梯度（标量→向量，对应方向导数）
$$\nabla u = \text{grad}\,u = \frac{\partial u}{\partial x}\vec{i}+\frac{\partial u}{\partial y}\vec{j}+\frac{\partial u}{\partial z}\vec{k}$$
2. 散度（向量→标量，高斯公式）
$$\nabla\cdot\vec{F} = \text{div}\,\vec{F} = \frac{\partial P}{\partial x}+\frac{\partial Q}{\partial y}+\frac{\partial R}{\partial z}$$
3. 旋度（向量→向量，斯托克斯公式）
$$
\nabla\times\vec{F} = \text{rot}\,\vec{F}
=
\begin{vmatrix}
\vec{i} & \vec{j} & \vec{k} \\
\frac{\partial}{\partial x} & \frac{\partial}{\partial y} & \frac{\partial}{\partial z} \\
P & Q & R
\end{vmatrix}
=\left(\frac{\partial R}{\partial y}-\frac{\partial Q}{\partial z}\right)\vec{i}
+\left(\frac{\partial P}{\partial z}-\frac{\partial R}{\partial x}\right)\vec{j}
+\left(\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}\right)\vec{k}
$$


# 线性代数
暂未完工...