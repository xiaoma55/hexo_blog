---
title: 记录一次github推送失败问题
index_img: /img/articleBg/1(71).jpg
banner_img: /img/articleBg/1(71).jpg
tags:
  - git
category:
  - - 博客
    - 技术
date: 2021-03-08 10:16:36
---

今天又同学指出了博客中的一个错别字，小马就屁颠屁颠去改了。

结果改完推送代码的时候，失败了，`oh~shit~~~`

<!-- more -->

## 1 事故现场

```
Push failed unable to access ‘***.git/‘:OpenSSL SSL_read: Connection was reset, errno 10054
```

![](/img/articleContent/记录一次github推送失败问题/1.png)

## 2 事故处理

> 执行一下命令就可以解决

```
git config --global http.sslBackend "openssl"
```

![](/img/articleContent/记录一次github推送失败问题/2.png)

> `蛋疼的事每天都会发生，不要惊慌，不要失措，接着造~~`

## 联系博主，加入【羊山丨交流社区】
![联系博主](/img/icon/wechatFindMe.png)
