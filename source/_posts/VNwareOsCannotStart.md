---
title: 记录一次VMWare无法启动虚拟机问题
index_img: /img/articleBg/1(13).jpg
banner_img: /img/articleBg/1(13).jpg
tags:
  - VMware
category:
  - - 博客
    - 技术
comment: 'off'
date: 2020-11-25 01:18:35
---

今天打开VMWare，突然打不开虚拟机，提示【VMware Workstation】 未能启动【VMWare Authorization Service】。您可以尝试手动启动【VMware Authorization】。

<!-- more -->

## 1.打开 VMWare Authorization Service

按下键盘上的 win + r ，输入
```
services.msc
```
找到 VMWare Authorization Service ，双击设置为【**手动**】或者【**自动**】，应用，确定。如下图

但是有的人提示【**拒绝访问**】，往下看

![开启 VMWare Authorization Service](/img/articleContent/VNwareOsCannotStart/VMwareOsCannotStart1.png)

## 2.打开火绒的VMware相关启动服务

然后我们再去开启所有被禁用的 VMWare Authorization Service，就好了，如下图

![开启 火绒VMware服务](/img/articleContent/VNwareOsCannotStart/VMwareOsCannotStart2.png)

## 3.完工

郁闷，自己手欠，火绒一顿操作把这个给禁用掉了，长记性。

## 联系博主，加入【羊山丨交流社区】
![联系博主](/img/icon/wechatFindMe.png)