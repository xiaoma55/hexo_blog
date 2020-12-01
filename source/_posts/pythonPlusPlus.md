---
title: python 支持自增(++)，自减(--)吗？
index_img: /img/articleBg/1(23).jpg
banner_img: /img/articleBg/1(23).jpg
tags:
  - AI
  - Python
category:
  - - 编程
    - Python
comment: 'off'
date: 2020-12-01 21:35:38
---

python中到底支不支持自增自减操作呢？

例如：i++,++i。

如果不可以，下面代码为什么不报错'a++ + ++a'

<!-- more -->

## 历史

python到底支不支持自增自减呢

![python下标](/img/articleContent/pythonPlusPlus/pythonPlusPlus.png)

看上图，python是不支持自增自减的。

至于为什么要去掉这个操作，我们可以看下[Stack Overflow上的一个回答](https://stackoverflow.com/questions/3654830/why-are-there-no-and-operators-in-python)

![为什么不要下标](/img/articleContent/pythonPlusPlus/pythonPlusPlus1.png)


大致意思就是说有了for-in循环，很少会用到++操作了，而且++操作需要在语言中添加操作码，是完全没必要的

## 疑惑

既然python不支持自增自减操作，那么下图代码为什么可以运行呢

![疑惑](/img/articleContent/pythonPlusPlus/pythonPlusPlus2.png)

[我们来看下google研发总监的观点](http://norvig.com/python-iaq.html)

![google研发总监观点](/img/articleContent/pythonPlusPlus/pythonPlusPlus3.png)


这样就一目了然了，哈哈哈，太有趣了

## 联系博主，加入【羊山丨交流社区】
![联系博主](/img/icon/wechatFindMe.png)