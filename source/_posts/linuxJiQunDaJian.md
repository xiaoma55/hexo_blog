---
title: Linux 集群搭建
index_img: /img/articleBg/1(32).jpg
banner_img: /img/articleBg/1(32).jpg
tags:
  - Cenos7
  - 大数据
category:
  - - 编程
    - 大数据
comment: 'off'
date: 2020-12-09 14:30:55
---

在学习linux的过程中，难免需要搭建个集群玩，今天就记录下搭建linux集群最基础的一些设置，当然，需要你先安装好一个linux虚拟机，可以查看{% post_link CenosInstallation 虚拟机安装 %} 和 {% post_link Cenos7CannotPingNet 虚拟机配置网络 %}。接下来，我们开始吧！

<!-- more -->

## 1 克隆虚拟机

![克隆虚拟机1](/img/articleContent/linuxJiQunDaJian/1.png)

![克隆虚拟机2](/img/articleContent/linuxJiQunDaJian/2.png)

![克隆虚拟机3](/img/articleContent/linuxJiQunDaJian/3.png)

![克隆虚拟机4](/img/articleContent/linuxJiQunDaJian/4.png)

![克隆虚拟机5](/img/articleContent/linuxJiQunDaJian/5.png)

## 2 配置MAC地址

![配置MAC地址](/img/articleContent/linuxJiQunDaJian/6.png)

## 3 配置ip

![配置ip](/img/articleContent/linuxJiQunDaJian/7配置ip.png)

重启网卡

```
systemctl restart network
```

## 4 配置主机名

```
vim /etc/hostname
```

![配置主机名](/img/articleContent/linuxJiQunDaJian/8主机名配置.png)

## 5 配置域名映射

修改下面文件，不要修改原文件内容，添加图中所示内容即可(每个虚拟机配置了两个别名)
```
vim /etc/hosts
```

![image](/img/articleContent/linuxJiQunDaJian/9配置域名映射.png)

## 6 关闭防火墙和Selinux

### 6.1 关闭防火墙

```
systemctl stop firewalld.service          #停止firewall
systemctl disable firewalld.service       #禁止firewall开机启动
systemctl status firewalld.service
```

![关闭防火墙](/img/articleContent/linuxJiQunDaJian/10关闭防火墙.png)

### 6.2 关闭SELinux

#### 6.2.1 什么是SELinux ?

> 1. SELinux是Linux的一种安全子系统<br/>
> 2. Linux中的权限管理是针对于文件的, 而不是针对进程的, 也就是说, 如果root启动了某个进程,  则这个进程可以操作任何一个文件。<br/>
> 3. SELinux在Linux的文件权限之外, 增加了对进程的限制, 进程只能在进程允许的范围内操作资源

#### 6.2.2 为什么要关闭SELinux ?

> 如果开启了SELinux, 需要做非常复杂的配置, 才能正常使用系统, 在学习阶段, 在非生产环境, 一般不使用SELinux

#### 6.2.3 SELinux的工作模式

```
enforcing  强制模式
permissive 宽容模式
disabled   关闭
```

#### 6.2.4 关闭SELinux

下面文件改为图中所示：SELINUX=disable

```
vim /etc/selinux/config 
```

![关闭SELinux](/img/articleContent/linuxJiQunDaJian/11关闭SELinux.png)

#### 6.2.5 分别重启三台虚拟机

```
reboot
```

## 7 三台服务器免密码登录

### 7.1 为什么要免密登录

> Hadoop 节点众多, 所以一般在主节点启动从节点, 这个时候就需要程序自动在主节点登录到从节点中, 如果不能免密就每次都要输入密码, 非常麻烦。

### 7.2 免密 SSH 登录的原理

> 1. 需要先在 B节点 配置 A节点 的公钥
> 2. A节点 请求 B节点 要求登录
> 3. B节点 使用 A节点 的公钥, 加密一段随机文本
> 4. A节点 使用私钥解密, 并发回给 B节点
> 5. B节点 验证文本是否正确

![免密码登录原理](/img/articleContent/linuxJiQunDaJian/12免密码登录原理.png)

### 7.3 实现步骤

#### 7.3.1 第一步：三台机器生成公钥与私钥

> 在三台机器执行以下命令，生成公钥与私钥

```
ssh-keygen -t rsa
```

执行该命令之后，按下三个回车即可，然后敲（三个回车），就会生成两个文件**id_rsa（私钥）**、**id_rsa.pub（公钥）**，默认保存在/root/.ssh目录。

![生成公钥与私钥](/img/articleContent/linuxJiQunDaJian/13生产公钥和私钥.png)

#### 7.3.2 第二步：拷贝公钥到同一台机器

> 三台机器将拷贝公钥到第一台机器<br/>
三台机器都执行命令：

```
ssh-copy-id node1
```

在执行该命令之后，需要输入yes和node1的密码:

![拷贝公钥到同一台机器](/img/articleContent/linuxJiQunDaJian/14拷贝公钥到node1.png)

第一台机器在/root/.ssh下会生产authorized_keys文件

#### 7.3.3 第三步：复制第一台机器的认证到其他机器

> 将第一台机器的公钥拷贝到其他机器上<br/>
在第一台机器上指行以下命令

```
scp /root/.ssh/authorized_keys node2:/root/.ssh
scp /root/.ssh/authorized_keys node3:/root/.ssh
```

执行命令时，需要输入yes和对方的密码

![image](/img/articleContent/linuxJiQunDaJian/15复制第一台机器的认证到其他机器.png)

其他机器在/root/.ssh下会生产authorized_keys文件

#### 7.3.4 第四步：测试SSH免密登录

```
ssh node2
exit
```

![image](/img/articleContent/linuxJiQunDaJian/16测试免密登录.png)

## 8 时钟同步

大数据集群一般都是内网环境，所以这个东西配置的话让运维去做

### 8.1 为什么需要时间同步（掌握）

> 因为很多分布式系统是有状态的, 比如说存储一个数据, A节点 记录的时间是1, B节点 记录的时间是2, 就会出问题

### 8.2 时钟同步方式

#### 8.2.1 方式一：通过网络进行时钟同步

![image](/img/articleContent/linuxJiQunDaJian/17时钟同步方式1.png)

通过网络连接外网进行时钟同步,必须保证虚拟机连上外网

1. 启动定时任务

```
crontab -e
```

2. 随后在输入界面键入以下内容，每隔一分钟就去连接阿里云时间同步服务器，进行时钟同步

```
*/1 * * * * /usr/sbin/ntpdate -u ntp4.aliyun.com;
```

#### 8.2.2 方式二：通过某一台机器进行同步（了解即可，千万不要配置）

![image](/img/articleContent/linuxJiQunDaJian/18时钟同步方式2.png)

> 以192.168.88.161这台服务器的时间为准进行时钟同步

##### 8.2.2.1 在node1虚拟机安装ntp并启动

1. 安装ntp服务

```
yum -y install ntp
```

2. 启动ntp服务

```
systemctl start  ntpd 
```

3 . 设置ntpd的服务开机启动

```
#关闭chrony,Chrony是NTP的另一种实现
systemctl disable chrony 
#设置ntp服务为开机启动
systemctl enable ntpd
```

##### 8.2.2.2 编辑node1的/etc/ntp.conf文件

编辑node1机器的/etc/ntp.conf

```
vim /etc/ntp.conf 
```

在文件中添加如下内容(授权192.168.88.0-192.168.88.255网段上的所有机器可以从这台机器上查询和同步时间)

```
restrict  192.168.88.0  mask  255.255.255.0  nomodify  notrap
```

注释一下四行内容:(集群在局域网中，不使用其他互联网上的时间)

```
#server  0.centos.pool.ntp.org
#server  1.centos.pool.ntp.org
#server  2.centos.pool.ntp.org
#server  3.centos.pool.ntp.org
```

去掉以下内容的注释，如果没有这两行注释，那就自己添加上(当该节点丢失网络连接，依然可以采用本地时间作为时间服务器为集群中的其他节点提供时间同步)

```
server   127.127.1.0 
fudge    127.127.1.0  stratum  10
```

![image](/img/articleContent/linuxJiQunDaJian/18时钟同步方式2_1.png)

配置以下内容，保证BIOS与系统时间同步 

```
vim /etc/sysconfig/ntpd 
```

添加一行内容  

```
SYNC_HWLOCK=yes 
```

![时钟同步方式2_2](/img/articleContent/linuxJiQunDaJian/18时钟同步方式2_2.png)

重启ntp服务

```
systemctl restart  ntpd  
```

##### 8.2.2.3 另外两台机器与第一台机器时间同步

另外两台机器与192.168.88.161进行时钟同步，在node2和node3机器上分别进行以下操作

```
crontab  -e
```

添加以下内容:(每隔一分钟与node1进行时钟同步)

```
*/1 * * * * /usr/sbin/ntpdate 192.168.88.161
```

## 联系博主，加入【羊山丨交流社区】
![联系博主](/img/icon/wechatFindMe.png)