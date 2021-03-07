---
title: Cenos7 安装 (超级超级详细的一篇教程)
index_img: /img/articleBg/1(10).jpg
banner_img: /img/articleBg/1(10).jpg
tags:
  - 软件
  - 安装
  - Linux
  - Cenos7
  - VMware
category:
  - - 编程
    - Linux
 
date: 2018-10-23 00:21:49
---

真的是手把手一步一步安装Cenos，截图截的我都累了，你可以想象到底有多详细，只要是个人，保证绝对绝对可以看懂，如果是个人但是狗一点的话也问题不大。

<!-- more -->

## 1.下载安装VMWare

安装虚拟机的工具有很多，我们选择强大又稳定的VMWare。

这个产品是收费产品，我给大家提高了安装包【**VMware-workstation-full-16**】，下面链接访问，因为有朋友安装一直不成功，到最后发现是自己VMware的问题，所以还是建议大家用我这个，稳定干净没毛病。

直接一步一步安装就好，不勾选什么定时更新什么的，其他没什么需要注意的。

```
链接：https://pan.baidu.com/s/1ntW6U2snWt_tfDdxufQylA 
提取码：6666 
复制这段内容后打开百度网盘手机App，操作更方便哦--来自百度网盘超级会员V3的分享
```

安装完之后就是下面这个样子，大家忽略我框出来那块，那是我已经安装好的几个虚拟机。

![VMWare](/img/articleContent/Cenos7/VMware.png)

## 2.下载Cenos

> 在[Cenos官网](https://www.centos.org/)下载就可以，如下图

![下载Cenos1](/img/articleContent/Cenos7/CenosDownload1.png)
![下载Cenos2](/img/articleContent/Cenos7/CenosDownload2.png)
![下载Cenos3](/img/articleContent/Cenos7/CenosDownload3.png)
![下载Cenos4](/img/articleContent/Cenos7/CenosDownload4.png)

## 3.安装Cenos

> 下面图片里我没有解释的，大家照着图片操作就行，详细到了一个步骤都没省略，心疼我自己

![安装Cenos1](/img/articleContent/Cenos7/Cenos1.png)
![安装Cenos2](/img/articleContent/Cenos7/Cenos2.png)
![安装Cenos3](/img/articleContent/Cenos7/Cenos3.png)
![安装Cenos4](/img/articleContent/Cenos7/Cenos4.png)
![安装Cenos5](/img/articleContent/Cenos7/Cenos5.png)

大家根据自己的需求选择处理器和核数，一般一个处理器，两个内核就OK。

![安装Cenos6](/img/articleContent/Cenos7/Cenos6.png)

选择为虚拟机分配的内存，一般2G左右就够用了。

![安装Cenos7](/img/articleContent/Cenos7/Cenos7.png)

这里选择 **NAT** 网络类型

![安装Cenos8](/img/articleContent/Cenos7/Cenos8.png)
![安装Cenos9](/img/articleContent/Cenos7/Cenos9.png)
![安装Cenos10](/img/articleContent/Cenos7/Cenos10.png)
![安装Cenos11](/img/articleContent/Cenos7/Cenos11.png)

选择为虚拟机分配的磁盘大小，一般20G就合适。

![安装Cenos12](/img/articleContent/Cenos7/Cenos12.png)
![安装Cenos13](/img/articleContent/Cenos7/Cenos13.png)
![安装Cenos14](/img/articleContent/Cenos7/Cenos14.png)
![安装Cenos15](/img/articleContent/Cenos7/Cenos15.png)

这里选择自己下载的Cenos镜像。

![安装Cenos16](/img/articleContent/Cenos7/Cenos16.png)
![安装Cenos17](/img/articleContent/Cenos7/Cenos17.png)
![安装Cenos18](/img/articleContent/Cenos7/Cenos18.png)
![安装Cenos19](/img/articleContent/Cenos7/Cenos19.png)
![安装Cenos20](/img/articleContent/Cenos7/Cenos20.png)
![安装Cenos21](/img/articleContent/Cenos7/Cenos21.png)
![安装Cenos22](/img/articleContent/Cenos7/Cenos22.png)
![安装Cenos23](/img/articleContent/Cenos7/Cenos23.png)
![安装Cenos24](/img/articleContent/Cenos7/Cenos24.png)
![安装Cenos25](/img/articleContent/Cenos7/Cenos25.png)
![安装Cenos26](/img/articleContent/Cenos7/Cenos26.png)

至此，我们的虚拟机就安装好了，但是他是不能访问网络的，需要配置ip，我们{% post_link CenosNetWorkSetting '下篇文章(点击跳转)' %}讲。

## 4.备份虚拟机

> 因为我们平时操作难免出现失误，比如误删了什么系统文件之类的，那么我们可以先备份一下刚刚安装的虚拟机，以后操作失误的时候，起码有个备份。

![备份虚拟机1](/img/articleContent/Cenos7/Cenos27.png)
![备份虚拟机2](/img/articleContent/Cenos7/Cenos28.png)
![备份虚拟机3](/img/articleContent/Cenos7/Cenos29.png)
![备份虚拟机4](/img/articleContent/Cenos7/Cenos30.png)
![备份虚拟机5](/img/articleContent/Cenos7/Cenos31.png)

到这里，我们虚拟机的安装和备份就全部搞完了，记住，还没有设置ip等，所以现在是不能访问的。

由于这一篇篇幅已经很长了，我们下一篇介绍Cenos的网络配置，{% post_link CenosNetWorkSetting '下篇文章(点击前往【Cenos7网络配置】)' %}

---

## 联系博主，加入【羊山丨交流社区】
![联系博主](/img/icon/wechatFindMe.png)