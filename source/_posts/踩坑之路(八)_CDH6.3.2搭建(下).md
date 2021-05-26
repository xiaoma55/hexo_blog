---
title: '踩坑之路(八) CDH6.3.2搭建(下)'
index_img: /img/articleBg/1(84).jpg
banner_img: /img/articleBg/1(84).jpg
tags:
  - 大数据
  - 踩坑之路
category:
  - - 编程
    - 大数据
    
date: 2021-05-24 11:10:57
---

上一篇把Cloudera Manager安装好了，这一篇开始安装CDH

<!-- more -->

## 1 版本选择

### 1.1 使用默认用户名密码登录

```shell
用户名: admin
密码: admin
```

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/1.png)

### 1.2 登录成功来到环境界面

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/2.png)

### 1.3 接受许可条款

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/3.png)

### 1.4 根据需要选择版本

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/4.png)

## 2 创建集群

### 2.1 欢迎界面

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/5.png)

### 2.2 集群命名

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/6.png)

### 2.3 选择主机

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/7.png)

### 2.4 配置仓库

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/8.png)

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/9.png)

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/10.png)

### 2.5 安装Parcels

> 这是一个拼人品的的环节

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/11.png)

> `出错了就去这两个地方看日志`

```shell
/var/log/cloudera-scm-agent
/var/log/cloudera-scm-server
```

### 2.6 集群检查

> `看我喜庆的界面`，搞了我大半天，哎，搞来搞去，最后是端口的问题，好烦，CDH要开好多好多端口，乖乖照着官网一个个开吧

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/12.png)

> 如果没关防火墙，这里大多是端口问题，我们公司就不能关防火墙，所以乖乖照着上一篇文章看哪些端口需要开放吧。

> 再执行下这个，这是解决第二个检查里的那个警告，之后就见下图了。

```shell
# 查看当前内核参数
sysctl vm.swappiness
# 临时修改
sysctl vm.swappiness=10
# 查看修改后内核参数
sysctl vm.swappiness
# 永久修改
sed -i s/"vm.swappiness = 30"/"vm.swappiness = 10"/g  /usr/lib/tuned/virtual-guest/tuned.conf
```

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/13.png) 

## 3 安装服务

### 3.1 安装HDFS和YARN

> `放行HDFS端口`

节点 | 端口 | 配置 | 用途
---|---|---|---
DateNode | `9870` | dfs.datanode.address | 可视化端口
DateNode | `50010` | dfs.datanode.address | datanode服务端口，用于数据传输
DateNode | `50075` | dfs.datanode.http.address | http服务的端口
DateNode | `50475` | dfs.datanode.https.address | http服务的端口
DateNode | `50020` | dfs.datanode.ipc.address | ipc服务的端口
NameNode | `50070` | dfs.namenode.http-address | http服务的端口
NameNode | `50470` | dfs.namenode.https-address | http服务的端口
NameNode | `8020` | fs.defaultFS | 接收Client连接的RPC端口，用于获取文件系统metadata信息。
journalnode | `8485` | dfs.journalnode.rpc-address | RPC服务
journalnode | `8480` | dfs.journalnode.http-address | HTTP服务
ZKFC | `8019` | dfs.ha.zkfc.port | ZooKeeper FailoverController，用于NN HA

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/14.png)

#### 3.1.1 角色分配

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/15.png)

#### 3.1.2 集群配置

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/16.png)

#### 3.1.3 开始安装

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/17.png)

##### 3.1.3.1 Failed to format NameNode.

> `错误`

```shell
Failed to format NameNode.

是由于之前初始化 namenode 在 /dfs/nn 留下了残留数据（失效数据），从而影响再次初始化
```

> 解决办法
>> 清空残留数据后，重新初始化

> namenode节点：

```
rm -rf /dfs/nn
```

> datanode节点：

```
rm -rf /dfs/dn
```

##### 3.1.3.2 First failure: Command (Create /tmp Directory (762)) has failed

> `错误`

```shell
First failure: Command (Create /tmp Directory (762)) has failed
Safe mode will be turned off automatically once the thresholds have been reached
```

> 按正常命令启动HDFS之后,HDFS一直处于安全模式。他会一会儿自己退出，我们目前先手动退出一下

```shell
sudo -u hdfs hdfs dfsadmin -safemode leave
```

##### 3.1.3.2 Failed to upload YARN MapReduce Framework JARs.

> `报错`

```shell
Failed to install YARN MapReduce Framework JARs.
Failed to upload YARN MapReduce Framework JARs.
```

> 解决
>> 这个我是端口的问题，去把需要的端口都放开吧(当然如果你关了防火墙就不会有这个问题)

```shell
需要开放的端口：
https://docs.cloudera.com/documentation/enterprise/latest/topics/cm_ig_ports.html
```

#### 3.1.4 完成

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/18.png)

## 4 警告修复

### 4.1 DNS Resolution

```shell
The hostname and canonical name for this host are not consistent when checked from a Java process.
```

> 解决

```shell
vim /etc/sysconfig/network
NETWORKING=yes
HOSTNAME= node1.lankr.cn               ##每台服务器配置自己的
systemctl restart network
```

```shell
问题缘由是在配置hostname的时候配置了域名，服务器根据/etc/resolv.conf DNF解析是，提示找不到改域名。
处理方式：在每台服务器上添加本地域名解析：(根据上述hosts配置，须要添加以下配置，domain 是本地域名的意思)

echo "domain lankr.cn" >> /etc/resolv.conf
```

### 4.2 Erasure Coding Policy Verification Test

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/19.png)

## 5 配置本地域名映射

```shell
C:\Windows\System32\drivers\etc\hosts
```

```shell
192.168.1.101 node1.lankr.cn node1
192.168.1.102 node2.lankr.cn node2
192.168.1.103 node3.lankr.cn node3
192.168.1.104 node4.lankr.cn node4
192.168.1.105 node5.lankr.cn node5
192.168.1.106 node6.lankr.cn node6
192.168.1.107 node7.lankr.cn node7
```

> 这样windows电脑就可以通过node1或者node1.lankr.cn来访问CM集群了，而不用ip了

## 联系博主，加入【羊山丨交流社区】
![联系博主](/img/icon/wechatFindMe.png)

