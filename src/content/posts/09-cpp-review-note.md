---
title: 蓝桥杯复习笔记
published: 2026-04-10
description: 2026年蓝桥杯紧急复习笔记，太忙了，没时间复习，只有临时抱一抱佛脚了，希望rp++;
image: ./covers/cover9.webp
tags: [蓝桥杯, C++, 复习笔记]
category: 复习笔记
draft: false
---

# 蓝桥杯复习笔记

## 一、图论加边操作

```cpp
//链式前向星的标准实现方式
void add(int x, int y, int z){ //点x到点y的一条权值为z的一条边
	ver[++tot] = y;  //ver表示新边的中点，tot记录第i条边(当前已添加边的总数)
	edge[tot] = z;   //edge记录边权值
	nxt[tot] = head[x]; //将新边的的“下一条边”指向原来x的最后一条边
	head[x] = tot;   //更新 head[x]，使其指向最新加入的这条边
}
```

## 二、Dijkstra求单元最短路径

**主要思路：**
- 1.选取一个点为起始点
- 2.设其他点到起始点的距离为dis[x]
- 3.每次BFS将点对应的所有出边(x, y, z)放入队列中
- 4.计算dis[y] = min(dis[y], dis[x] + z)

**优化思路：堆**

使用堆对dis数组进行维护

核心代码如下：
```cpp
int head[N], ver[M], edge[M], nxt[M], dis[N]; // n个点，m条边
bool v[N];
int n, m, tot, st;
priority_queue<pair<int, int> > q; //pair.first存距离，pair.second存点序号

void add(int x, int y, int z){
	ver[++tot] = y;
	edge[tot] = z;
	nxt[tot] = head[x];
	head[x] = tot;
}
void dij(){
	memset(v, 0, sizeof(v));
	memset(dis, 0x3f, sizeof(dis));
	dis[st] = 0;
	q.push(make_pair(0, st)); //将起始点压入大根堆中
	while(q.size()){ //如果q不为空，说明还有点存在
		int x = q.top().second;q.pop(); 
		if(v[x]) continue;
		v[x] = 1;
		for(int i = head[x]; i; i = nxt[i]){ //枚举当前点的每一条出边
			int y = ver[i], z = edge[i];
			if(dis[y] > dis[x] + z){ //代码思路（本质是贪心）
				dis[y] = dis[x] + z;
				q.push(make_pair(-dis[y], y)); //存的时候存负的，大根堆变成小根堆
			}
		}
	}
} 
int main(){
	ios::sync_with_stdio(0);
	cin.tie(0);cout.tie(0);
	cin >> n >> m >> st;
	for(int i = 1; i <= m; i++){
		int x, y, z;
		cin >> x >> y >> z;
		add(x, y, z); //加边操作
	}
	dij();
	for(int i = 1; i <= n; i++)
		cout << d[i] << " "; 
	return 0;
}

```

## 三、简单数论

- #### 质数的判定

```cpp
bool isprime(int n){
    if(n < 2) return 0;
    for(int i = 2; i <= sqrt(n); i++)
        if(n % i == 0) return 0;
    return 1;
}
```

- #### 指数的筛选

```cpp
bool v[];
void find_primes(int n;){
    memset(v, 0, sizeof(v));
    for(int i = 2; i <= n; i++){
        if(v[i]) continue;
        cout << i << " ";
        for(j = 1; j <= n/i; j++) v[i*j] = 1;
    }
}
```

- #### 质因数分解
```cpp
void divide(int n){
    int m = 0;
    for(int i = 2; i <= sqrt(n); i++){
        if(n % i == 0){  //i 是质数
            prime[++m] = i，c[m] = 0;
            while(n % i == 0) n /= i, c[i]++;  //除掉所有的i;
        }
        if(n > 1)
            p[++m] = n, c[m] = 1;
        for(int i = 1; i <= m; i++)
            cout << p[i] << "^" << c[i] << "*";
    }
}
```

- #### 最大公约数&最小公倍数

```cpp
int gcd(int a, int b){
    return b ? gcd(b, a % b) : a;
}
int lcd(int a, int b){
    return a * b / gcd(a, b);
}
```

- #### 欧拉函数

1~N 中与 N 互质的数的个数被称为欧拉函数

```cpp
int phi(int n){
    int ans = n;
    for(int i = 1; i <= sqrt(n); i++){
        if(n % i == 0){
            ans = ans * (i - 1) / i;
            while(n % i == 0) n /= i;
        }
        if(n > 1) ans = ans * (n - 1) / n;
    }
    return ans;
}
```

## 四、快速幂

#### 求a * b % p的值，其中1 <= a, b, p <= 10^18

```cpp
long long fastpow(long long a, long long b, long long p){
    long long ans = 1;
    for(; b; b >>= 1){//使得指数b为证时运算，每个循环后b除以二并向下取证
        if(b & 1) ans = ans * a % p;//当b为奇数时累乘到ans中
        a = a * a % p;//算法核心 即：b为偶数时 a^b=(a*a)^(b/2)
    }
    return ans;
}
```

## 五、sort中CMP写法

```cpp
sort(p.begin(), p.end(), cmp); //无cmp时，sort默认从大到小
sort(a, a+n);
sort(a+1, a+n+1); //对比，注意用下标排序
```

```cpp
struct node{
    int score;
    int id;
	string name;
} stu[10000];
bool cmp(node a, node b){
	if(a.score != b.score) return a.score > b.score;
    else return a.name > b.name;
}
```
```c
//C语言中默认无重载运算符，不可以直接用<>=比较，使用strcmp函数
struct node{
    int score;
    int id;
	char name[100];
} stu[10000];
bool cmp(node a, node b){
	if(a.score != b.score) return a.score > b.score;
    else return strcmp(a.name, b.name);
}
```

## 六、并查集
```cpp
int f[1000];  //存每个元素的爸爸
int find(int x){
	if(f[x] == x) return x; //自己是自己的爸爸
	return f[x] = find(f[x]); //自己有爸爸，那就找找爸爸的爸爸是谁？找到的也是自己的爸爸
}
```

## 七、STL函数的用法

- 二分查找
```cpp
lower_bound(first, last, val) // 指向第一个 >= 4 的位置
upper_bound(first, last, val) // 指向第一个 > 4 的位置
```

- 自动全排列

`next_permutation(first, last)` 
按升序生成所有可能的排列，排列为字典序中的下一个排列
如果当前排列已是字典序最大的排列（即降序排列），则返回 false

**用法：**
```cpp
string s = "abc";//s = "123";

sort(s.begin(), s.end()); // 确保从最小字典序开始
do{
    cout << s << endl;
} while(next_permutation(s.begin(), s.end()));
// 输出: abc, acb, bac, bca, cab, cba
```

## 八、组合数学和乘法逆元
```cpp
long long fact[N];    // 阶乘数组: fact[i] = i! % MOD
//fact[i] = (fact[i - 1] * i) % MOD;

long long inv_fact[N];  // 阶乘逆元数组: inv_fact[i] = (i!)^(MOD-2)% MOD
for(int i = 1; i <= max_n; ++i)
	inv_fact[max_n] = quick_pow(fact[max_n], MOD - 2, MOD); // 利用费马小定理计算最大阶乘的逆元

for(int i = max_n - 1; i >= 0; --i)
	inv_fact[i] = (inv_fact[i + 1] * (i + 1)) % MOD; // 递推计算其他阶乘的逆元: (i-1)!^-1 = i!^-1 * i
```