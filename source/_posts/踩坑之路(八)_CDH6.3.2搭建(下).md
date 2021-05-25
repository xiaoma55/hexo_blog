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

![](/img/articleContent/踩坑之路/8_CDH6.3.2搭建(下)/12.png)

> 卡在这里了，大佬们指个路

## 3 安装服务



## 联系博主，加入【羊山丨交流社区】
![联系博主](/img/icon/wechatFindMe.png)
