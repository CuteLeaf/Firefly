---
title: 编译自己的Linux发行版
published: 2025-09-06
description: 本文讲述了如何编译自己的Linux发行版，并安装软件包管理器。
tags:
  - Linux
  - kernel
category: 系统
draft: false
lang: zh_CN
---

# 如何编译自己的Linux发行版？

  这几天在逛B站的时候看见了一个讲如何编译Linux发行版的视频[视频链接](https://www.bilibili.com/video/BV1bFNSeREvV/)心血来潮，就想自己编译一个Linux发行版。
<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV1bFNSeREvV" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

### 如果你想编译你自己的Linux内核，你需要。
- Linux环境
- 足够的存储空间
- 有耐心

#### 编译Linux内核

  Linux内核是Linux操作系统的核心组件，负责管理计算机的硬件资源，并为用户空间程序提供系统调用接口。可见，内核的重要性不言而喻。

我们先到[www.kernel.org](https://www.kernel.org/)下载内核（stable版本似乎更好）把tarball的链接复制下来，这里已6.16.4版本做演示。

把压缩包wget下来(用curl也行)

```shell
wget https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.16.4.tar.xz
```

#### 解压
把下载下来的压缩包进行解压
```shell
tar -xf inux-6.16.4.tar.xz
```

#### 配置内核
先cd到对应目录
```shell
cd inux-6.16.4
```
我就直接使用默认配置了。如果需要可以调整配置。
```shell
make  defconfig
```
使用编译命令。(-j是要使用多少个核心)
```shell
make -j4
``` 
等待编译完成后会提示内核的输出路径，我编译的是x86的。
```shell
linux-6.16.4/arch/x86/boot/bzImage
```

#### 给系统装一些简易的程序
这里用到了[busybox](https://busybox.net/)里面有很多的常用应用，比如ls，rm，ping，cd之类的（唯一的缺点就是少了一个包管理器）

到busybox的官网下载tar压缩包(这官网有点慢啊！)

![busybox-site](https://cdn.jsdelivr.net/gh/MCKero6423/picx-images-hosting@master/busybox-site.13m4k72a71.webp)

选择Download Source接着，滑到最底下找到1.37.0版本(大约2mb左右,那些大小太少的好像是用来校验的,你要是想也可以全下载下来一个一个找😆)

![busybox-download](https://cdn.jsdelivr.net/gh/MCKero6423/picx-images-hosting@master/busybox-download.mf9b4p68.webp)
```shell
wget https://busybox.net/downloads/busybox-1.37.0.tar.bz2
```

#### 解压busybox
还是老生常谈的解压
```shell
tar -xf busybox-1.37.0.tar.bz2
```

#### 配置busybox
解压完后cd进对应目录，配置busybox，由于我们这个系统简直就是一个毛坯房，几乎啥都没有，所以说要用静态编译。先去配置一下。
```shell
make menuconfig
```
进到settings(按enter)找到Build Busybox as a static binary(no shared libs)按空格选择，按→选Exit

回到主界面后选择一个network开头的选项，找到tc按空格取消选择，再按→选Exit回到主界面，按→选Exit，选择后按y。

#### 编译busybox
配置完后就开始编译
```shell
make -j 2
```
编译完成后，在你的工作目录创建一个临时目录
```shell
mkdir busybox
```
然后
```shell
make install CONFIG_PREFIX=../busybox
```
#### 编辑img文件
使用dd命令创建一个全都是0的文件
```shell
dd if=/dev/zero of=Linux.img bs=1M count=512)
```
给img文件分区

```shell
gdisk Linux.img
```
输入n，后面两个按空格，最后一个输入50MB，guid填写EF00(注意大小写)

再次输入n，后面全部默认，最后输入w，然后y，保存分区表。

#### 挂载
先使用losetup将一个文件或设备与一个回环设备（loop device）进行关联。

```shell
sudo losetup -f -P Linux.img
```
lsblk查看

```shell
lsblk
```
找到Linux的loop，我这边是loop0里面有loop0p1，loop0p1。

loop0p1
```shell
sudo mkfs.fat -F32 /dev/loop0p1
```
loop0p2
```shell
sudo mkfs.exit4 /dev/loop0p2
```
在工作目录创建一个mnt文件夹
```shell
mkdir mnt
```
挂载loop0p1
```shell
sudo mount /dev/loop0p1 mnt
```
#### 创建 EFI
```shell
sudo grub-install --target=x86_64-efi --efi-directory=$(realpath mnt) --bootloader-id=GRUB --removable --recheck
```
查看mnt里面的文件，应该会有一个叫做EFI的文件夹
```shell
ls mnt
```
创建一个在mnt/BOOT/grub的文件夹
```shell
mkdir -p mnt/boot/grub
```
复制文件
```shell
cp mnt/BOOT/grub.cfg /mnt/boot/grub
```
查看loop0p2的id
```shell
blkid /dev/loop0p2
```
把UUID物复制下来，替换mnt/boot/grub/grub.cfg中的UUID，然后把修改后的文件直接复制替换到mnt/EFI/BOOT/grub.cfg

回到mnt的上一层，解除挂载。
```shell
sudo umount mnt
```

#### 给系统搞个根目录
先挂载 loop0p2
```shell
sudo mount /dev/loop0p2 mnt
```
复制内核文件到mnt
```shell
sudo cp linux-6.16.4/arch/x86/boot/bzImage mnt
```
把busybox编译出来的二进制文件移到对应目录
```shell
sudo cp -r busybox/* mnt
```
cd到mnt
``` shell
cd mnt
```
创建boot文件夹
```shell
mkdir boot
```
创建其他需要的目录(有些文件创建来就是空着的，方便后期不用创建，比如说包管理器就要用etc文件夹
```shell
mkdir proc

mkdir sys

mkdir etc
```
把bzImage文件移动到boot文件夹
```shell
sudo mv bzImage boot/
```
跳转boot目录，ls检查一下
```shell
cd boot

ls
```
如果没有问题就能看到bzImage文件
```shell
bzImage
```
创建grub文件夹
```shell
mkdir grub
```
cd到grub
```shell
cd grub
```
创建一个文件叫grub.cfg
```shell
vim grub.cfg
```
里面的内容按这个填
```shell title="grub.cfg"
menuentry "Unics_MCKero" {
    insmod part_gpt
    insmod fat
    insmod ext2
    insmod normal
    search --no-floppy --fs-uuid --set=root a1fa9865-69c0-4997-8936-4ed1dd4d6452
    linux /boot/bzImage root=PARTUUID=62052f8c-686c-4656-8461-bb3e0790d62a rw init=/boot/init rootdelay=3 console=ttyS0
}
```
Unics_MCKero这个是你的引导程序的名字可以修改(尽量使用英文，我不知道用特殊字符或者中文会不会不兼容)

执行这个查看loop0p2的UUID
```shell
blkid /dev/loop0p2
```
mnt/boot/grub.cfg里面的set=root 这个后面填写loop0p2的UUID

PARTUUID这里填写blkid /dev/loop0p2输出的PARTUUID，然后保存

跳转到mnt的boot目录(因为我在mnt的boot/grub目录所以说我就直接使用直接返回上一层）
```shell
cd ..
```
创建一个名为init的文件
```shell
vim init
```
内容就写这个
```shell
#!/bin/sh

mount -t sysfs none /sys
mount -t proc none /proc
mount -t devtmpfs devtmpfs /dev

exec /bin/sh
```
给init执行权限(一定要给,如果没给系统运行不了)
```shell
chmod +x init
```
#### 网络
现在我们这个Linux发行版已经差不多完工了，现在我们需要让这个系统可以连接网络。

先到这个项目的仓库[ifupdown-ng的github仓库](https://github.com/ifupdown-ng/ifupdown-ng)这是一个用c语言编写的项目，比较轻量，它可以用来管理网络设备。

我们先把他的仓库克隆下来
```shell
git clone  https://github.com/ifupdown-ng/ifupdown-ng.git
```
跳转进仓库
```shell
cd ifupdown-ng
```
因为我们的小系统没有依赖库，所以说我们需要静态编译这个程序。
```shell
LDFLAGS="-static" make
```
把编译出来的文件复制到mnt/bin里面
```shell
cp ./ifupdown-ng/if* mnt/bin
```
记得给这些文件执行的权限

在mnt文件夹中创建一个叫etc的文件夹再往里面创建一个叫做network的文件夹。
```shell
sudo mkdir -p mnt/etc/network
```
在mnt/etc/network中创建一个文件，名字叫interfaces
```shell
vim mnt/etc/network/interfaces
```
里面的内容填这个
```shell
auto lo
iface lo inet loopback

auto eth0
iface eth0 inet dhcp
```
创建一个文件夹在mnt/etc/usr/share/名称叫udhcpc
```shell
mkdir -p mnt/etc/usr/share/udhcpc
```
在udhcpc文件夹中创建一个文件叫default.script
```shell
sudo vim mnt/etc/usr/share/udhcpc/default.script
```
里面填写这个
```shell title="default.script"
#!/bin/sh
[ -n "$ip" ] && ip addr add $ip/$subnet dev $interface
[ -n "$router" ] && ip route add default via $router
[ -n "$dns" ] && echo "nameserver $dns" > /etc/resolv.conf
```
记得保存

给default.script可执行权限
```shell
chmod +x default.script
```
到时候在虚拟机或者实体机直接输入
```shell
ifup lo

ifup eth0
```
验证是不是得到了IP地址
```shell
ip a
```
如果eth0有ip那就是配置好了，可以ping baidu.com试一试。

现在网络就配置好了，系统可以联网了。

#### 安装软件包管理器
软件包管理器（Package Manager）是一种自动化工具，用于管理软件包及其依赖关系。它可以简化软件的安装、更新、卸载和配置过程。

软件包管理器有很多种，这里选择apk这个软件包管理器，因为它比轻量，而且在仓库里也有已经编译好的二进制文件。

访问[apk-tools的仓库](https://gitlab.alpinelinux.org/alpine/apk-tools)找到release在Other下方有很多apk.static括号里面跟着指令集版本，比如，x86，x86_64和其他的，选择自己内核的指令集（我的是x86）所以说我选apk.static(x86)。

把apk.static下载下来
```shell
wget https://gitlab.alpinelinux.org/api/v4/projects/5/packages/generic//v2.14.10/x86/apk.static
```
跳转到mnt
```shell
cd mnt
```
创建以下目录（一个一个执行）
```shell
mkdir -p /etc/apk/keys

mkdir -p /var/lib/apk

mkdir -p /var/cache/apk

mkdir -p /var/lock
```
把apk.static命名为apk，然后移动到mnt/bin  给apk可执行权限。

在/etc/apk创建一个repositories文件
```shell title="repositories"
vim /etc/apk/repositories
```
里面填写这两个网址
```shell
http://dl-cdn.alpinelinux.org/alpine/latest-stable/main
http://dl-cdn.alpinelinux.org/alpine/latest-stable/community
```
下载key文件
```shell
git clone https://gitlab.alpinelinux.org/alpine/aports --depth 1
```
跳转到aports
```shell
cd aports/main/alpine-keys
```
把这些.rsa.pub文件全复制到mnt/etc/apk/keys

#### 结尾
花了一整天写这个文章，虽然没有什么图片，但是结合其他资料也是可以用的，感谢B站UP主于小乐_Unics
