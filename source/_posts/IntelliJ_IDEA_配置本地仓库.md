---
title: IntelliJ IDEA 配置本地maven仓库
index_img: /img/articleBg/1(36).jpg
banner_img: /img/articleBg/1(36).jpg
tags:
  - JetBrains
  - IDEA
  - maven
category:
  - - 编程
    - IDEA
 
date: 2019-06-21 23:12:55
---

平时开发有时候需要用到本地仓库，今天记录一下IDEA配置本地仓库的过程，以后有需要的时候自己看。

<!-- more -->

## 1 下载maven

[官网](https://maven.apache.org/download.cgi)

![下载maven](/img/articleContent/IntelliJ_IDEA_配置本地仓库/maven.png)

## 2 修改maven配置文件

> D:\soft\apache-maven-3.6.3\conf\settings.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>


<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 
          http://maven.apache.org/xsd/settings-1.0.0.xsd">
          
  <!--本地仓库目录-->
  <localRepository>D:/soft/maven/repository</localRepository>
	<mirrors>
	  <mirror>
	    <!--该镜像的id-->
	    <id>nexus-aliyun</id>
	    <!--该镜像用来取代的远程仓库，central是中央仓库的id-->
	    <mirrorOf>central</mirrorOf>
	    <name>Nexus aliyun</name>
	    <!--该镜像的仓库地址，这里是用的阿里的仓库-->
	    <url>http://maven.aliyun.com/nexus/content/groups/public</url>
	  </mirror>
	</mirrors>
</settings>
```

## 3 修改IDEA新项目配置

> 这个不修改的话，每次打开，都是用IDEA默认的maven库

![修改IDEA新项目配置](/img/articleContent/IntelliJ_IDEA_配置本地仓库/IDEA_MAVEN_1.png)

## 4 修改IDEA当前项目配置

![修改IDEA当前项目配置](/img/articleContent/IntelliJ_IDEA_配置本地仓库/IDEA_MAVEN_2.png)

## 联系博主，加入【羊山丨交流社区】
![联系博主](/img/icon/wechatFindMe.png)