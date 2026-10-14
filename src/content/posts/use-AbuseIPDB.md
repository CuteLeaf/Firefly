---
title: 报告Cloudflare waf拦截的IP
published: 2025-11-25
description: 最近看了waf，来扫描我的博客的机器人太多了，大部分还都用的是抗举报服务商，只能找一个数据库举报滥用了。
tags:
  - cloudflare
  - AbuseIPDB
category: cloudflare
draft: false
series: cloudflare
lang: zh_CN
---

# 报告Cloudflare waf拦截的IP
最近看cloudflare的waf统计里面来扫描的IP越来越多了，我就想找一个渠道来举报这些Ip，为社区做做贡献。

## AbuseIPDB是什么
  AbuseIPDB 是一个专门用于报告和查询恶意 IP 地址的在线数据库。它的主要目标是帮助用户识别和防范与特定 IP 地址相关的滥用行为，例如网络攻击、垃圾邮件、端口扫描和暴力破解等。
   
  它还是由社区驱动的，大部分的数据来源都是源于用户。


## 如何在AbuseIPDB查看IP？
[AbuseIPDB](https://www.abuseipdb.com/)进入AbuseIPDB的官网后

![](https://img.mckero.com/use-AbuseIPDB/AbuseIPDB-website.avif)

可以看到在这里就可以查看IP的欺诈度。

我查看一下1.1.1.1
![](https://img.mckero.com/use-AbuseIPDB/AbuseIPDB-check-cloudflare-dns.avif)

可以看到1.1.1.1是有白名单的，因为这是cloudflare的DNS服务。

## 注册AbuseIPDB
点击Sign up

![](https://img.mckero.com/use-AbuseIPDB/AbuseIPDB-Signup.avif)

然后会让我们选择API的调用计划
你要是没有大量的需求就不用付费。
所以我就选Free

![](https://img.mckero.com/use-AbuseIPDB/AbuseIPDB-plan.avif)

就会跳转到这个页面，正常填写就好

![](https://img.mckero.com/use-AbuseIPDB/AbuseIPDB-Signup-input.avif)

就是有一个地方要注意，这里如果你不是站长就选个人，如果你是站长(就像我有一个域名和网站,待会要验证站长身份)就选站长，然后填写你的域名。(不是子域名😂)

![](https://img.mckero.com/use-AbuseIPDB/AbuseIPDB-Signup-focal-point.avif)

注册好以后，要邮箱验证，看看邮箱收件箱点一下验证的链接。
站长验证也是很简单，就给你的域名加个TXT记录就好了（不要删除记录，后续可能还要检查）

![](https://img.mckero.com/use-AbuseIPDB/AbuseIPDB-Webmaster-verification.avif)

## AbuseIPDB贡献者徽章
这个徽章我已经挂在[我的博客关于](https://blog.mckero.com/about/)

![](https://img.mckero.com/use-AbuseIPDB/blog-Contributor-Badge/AbuseIPDB-Contributor-Badge-myblog-about.avif)

可以看到，还是很美观的，可以实时展示你举报的IP数量。（数量可能有些延迟）

## 举报IP
举报IP是通过api的（我当时还不知道😂😂😂）
我就不一个一个curl了，我让ai生成了一个脚本，还算方便。
```bash
#!/bin/bash

# ====================================================================================
# AbuseIPDB Advanced Reporter Script v2.0
#
# Features:
# - Secure API Key storage in a .conf file.
# - Interactive menu for selecting report categories.
# - Smart, template-based comment generation with dynamic info gathering.
# ====================================================================================

# --- 配置 ---
CONFIG_FILE="abuseipdb.conf"
API_ENDPOINT="https://api.abuseipdb.com/api/v2/report"

# --- 颜色定义 ---
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# --- 全局变量 ---
IP_ADDRESS=""
CATEGORY_ID=""
COMMENT=""
TIMESTAMP=""

# --- 函数：设置/加载API密钥 ---
function setup_api_key() {
    if [ ! -f "$CONFIG_FILE" ]; then
        echo -e "${YELLOW}配置文件 '$CONFIG_FILE' 未找到。${NC}"
        read -p "请输入您的 AbuseIPDB API Key: " new_key
        if [ -z "$new_key" ]; then
            echo -e "${RED}错误：API Key 不能为空。退出脚本。${NC}"; exit 1;
        fi
        echo "API_KEY=\"$new_key\"" > "$CONFIG_FILE"
        echo -e "${GREEN}API Key 已成功保存到 '$CONFIG_FILE'。${NC}\n"
    fi
    source "$CONFIG_FILE"
    if [ -z "$API_KEY" ]; then
        echo -e "${RED}错误：在 '$CONFIG_FILE' 中找不到 API_KEY 或其值为空。${NC}"; exit 1;
    fi
}

# --- 函数：处理暴力破解 [18] ---
function handle_brute_force() {
    CATEGORY_ID="18"
    echo -e "\n${YELLOW}请输入暴力破解攻击的详细信息...${NC}"
    read -p "  -> 攻击的服务 (e.g., SSH, FTP, SMTP, WordPress): " service_name
    read -p "  -> 尝试的用户名 (留空则忽略): " username
    
    COMMENT="Automated report: Brute-force attack detected on service '$service_name' from IP $IP_ADDRESS at $TIMESTAMP."
    if [ -n "$username" ]; then
        COMMENT+=" Multiple failed login attempts were recorded for username '$username'."
    fi
}

# --- 函数：处理SSH攻击 [22] ---
function handle_ssh() {
    CATEGORY_ID="22"
    echo -e "\n${YELLOW}请输入SSH攻击的详细信息...${NC}"
    read -p "  -> 尝试的用户名 (e.g., root, admin. 留空则忽略): " username
    
    COMMENT="Automated report: SSH brute-force attack detected from IP $IP_ADDRESS at $TIMESTAMP."
    if [ -n "$username" ]; then
        COMMENT+=" Multiple failed login attempts were recorded for username '$username'."
    else
        COMMENT+=" Multiple failed login attempts were recorded with various usernames."
    fi
}

# --- 函数：处理端口扫描 [14] ---
function handle_port_scan() {
    CATEGORY_ID="14"
    echo -e "\n${YELLOW}请输入端口扫描的详细信息...${NC}"
    read -p "  -> 扫描的端口号 (e.g., 22, 80, 443. 留空则忽略): " scanned_ports
    
    COMMENT="Automated report: Port scan detected from IP $IP_ADDRESS at $TIMESTAMP."
    if [ -n "$scanned_ports" ]; then
        COMMENT+=" Scanned ports include: $scanned_ports."
    fi
}

# --- 函数：处理Web攻击 [21] ---
function handle_web_attack() {
    CATEGORY_ID="21"
    echo -e "\n${YELLOW}请输入Web攻击的详细信息...${NC}"
    read -p "  -> 攻击的目标域名 (e.g., example.com): " target_host
    read -p "  -> 访问的恶意路径 (e.g., /wp-login.php): " request_path
    
    COMMENT="Automated report: Web attack attempt detected on host '$target_host' from IP $IP_ADDRESS at $TIMESTAMP."
    COMMENT+=" The attacker accessed the malicious path: '$request_path'."
}

# --- 函数：处理恶意Web机器人 [20] ---
function handle_bad_bot() {
    CATEGORY_ID="20"
    echo -e "\n${YELLOW}请输入恶意Web机器人的详细信息...${NC}"
    read -p "  -> 访问的目标域名 (e.g., example.com): " target_host
    read -p "  -> 访问的路径 (e.g., /): " request_path
    read -p "  -> 机器人的User-Agent (留空则忽略): " user_agent
    
    COMMENT="Automated report: Bad Web Bot activity detected on host '$target_host' from IP $IP_ADDRESS at $TIMESTAMP."
    COMMENT+=" The bot was blocked while accessing '$request_path'."
    if [ -n "$user_agent" ]; then
        COMMENT+=" User-Agent: '$user_agent'."
    fi
}

# --- 函数：处理自定义输入 ---
function handle_custom() {
    echo -e "\n${YELLOW}请输入自定义举报信息...${NC}"
    read -p "  -> 自定义类别ID (例如 18,21): " CATEGORY_ID
    if [ -z "$CATEGORY_ID" ]; then echo -e "${RED}类别ID不能为空。${NC}"; return 1; fi
    read -p "  -> 自定义评论: " COMMENT
    if [ -z "$COMMENT" ]; then echo -e "${RED}评论不能为空。${NC}"; return 1; fi
}


# --- 主程序 ---
function main() {
    setup_api_key
    while true; do
        clear
        echo -e "${BLUE}==========================================${NC}"
        echo -e "${BLUE}    AbuseIPDB 高级举报脚本 v2.0    ${NC}"
        echo -e "${BLUE}==========================================${NC}"
        
        read -p "请输入您要举报的IP地址: " IP_ADDRESS
        if [ -z "$IP_ADDRESS" ]; then
            echo -e "${RED}错误：IP地址不能为空。${NC}"; sleep 2; continue;
        fi

        echo -e "\n${YELLOW}请选择一个举报类别 (输入数字):${NC}"
        echo " 1) [18] Brute-Force (暴力破解)"
        echo " 2) [22] SSH (SSH登录攻击)"
        echo " 3) [14] Port Scan (端口扫描)"
        echo " 4) [21] Web Attack / Hacking (Web攻击)"
        echo " 5) [20] Bad Web Bot (恶意网络机器人)"
        echo " 9) [自定义] 手动输入所有信息"
        echo " q) [退出]"
        read -p "您的选择: " choice

        # 重置变量并获取当前时间戳
        CATEGORY_ID=""
        COMMENT=""
        TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

        # 根据选择调用相应的处理函数
        case "$choice" in
            1) handle_brute_force ;;
            2) handle_ssh ;;
            3) handle_port_scan ;;
            4) handle_web_attack ;;
            5) handle_bad_bot ;;
            9) handle_custom ;;
            q|Q) echo -e "${GREEN}感谢使用，再见！${NC}"; exit 0 ;;
            *) echo -e "${RED}无效的选择，请重试。${NC}"; sleep 2; continue ;;
        esac

        # 检查处理函数是否成功设置了变量
        if [ -z "$CATEGORY_ID" ] || [ -z "$COMMENT" ]; then
            echo -e "${RED}信息不完整，返回主菜单。${NC}"; sleep 2; continue;
        fi

        echo -e "\n${BLUE}--- 请确认最终举报信息 ---${NC}"
        echo -e "  IP 地址: ${GREEN}$IP_ADDRESS${NC}"
        echo -e "  类别 ID: ${GREEN}$CATEGORY_ID${NC}"
        echo -e "  最终评论: ${GREEN}$COMMENT${NC}"
        read -p "确认提交举报吗? (y/n): " confirm

        if [[ "$confirm" =~ ^[Yy]$ ]]; then
            echo -e "\n${YELLOW}正在提交举报...${NC}"
            RESPONSE=$(curl -s --request POST \
                 --url "$API_ENDPOINT" \
                 --header "Accept: application/json" \
                 --header "Key: $API_KEY" \
                 --data-urlencode "ip=$IP_ADDRESS" \
                 --data-urlencode "categories=$CATEGORY_ID" \
                 --data-urlencode "comment=$COMMENT")
            
            echo -e "${BLUE}--- 服务器响应 ---${NC}"
            if command -v jq &> /dev/null; then
                echo "$RESPONSE" | jq
            else
                echo "$RESPONSE"
            fi
            echo -e "${BLUE}--------------------${NC}"
        else
            echo -e "${RED}操作已取消。${NC}"
        fi

        read -p "按 [Enter] 键继续或按 [Ctrl+C] 退出..."
    done
}

# --- 运行主程序 ---
main
```
感觉良好。我试用了一下，还是很好的举报类别可以在AbuseIPDB api调用文档查，这里只有几个常用的。