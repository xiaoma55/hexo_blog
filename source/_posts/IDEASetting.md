---
title: IntelliJ IDEA 配置(小马多年血泪沉淀下来的)
index_img: /img/articleBg/1(6).jpg
banner_img: /img/articleBg/1(6).jpg
tags:
  - JetBrains
  - IDEA
  - 配置
category:
  - - 软件
    - 配置
comment: 'off'
date: 2020-11-22 01:26:20
---

作为一名程序猿，为了能够减缓秃头的旅程，

我觉得一套好用的配置确实能够起到不小的作用。

JAVA秃头人最常用的软件莫过于IDEA了。

今天我就分享一下我这些年自己沉淀下来的一些配置。

有其他好用配置的朋友，可以在下方留言呦！

## 1.忽略大小写开关

> 写代码时，比如需要定义string类型变量，那么我们输入小写s的时候，idea默认是不会提示String的。这个设置就可以忽略掉大小写，输入小写s也可以提示String。

![忽略大小写开关](/img/articleContent/IDEASetting/ignoreMatchCase.png)

## 2.取消单行显示tabs的操作

> 如果我们打开的类过多，那么idea只会显示一行，之前打开的就不见了，下面这个设置就可以让我们打开的类都显示。

先看下没设置之前，只能打开一行。

![取消单行显示tabs的操作](/img/articleContent/IDEASetting/showTabsInOneRowBefore.png)

再看下设置之后，打开的类分多行显示。

![取消单行显示tabs的操作](/img/articleContent/IDEASetting/showTabsInOneRowAfter.png)

设置方法。

![取消单行显示tabs的操作](/img/articleContent/IDEASetting/showTabsInOneRow.png)

## 3.项目文件编码

> 有时候，项目写着写着，就会遇到很烦的编码问题，我们把编码设置成下面这样，基本就可以杜绝这种情况了。

![项目文件编码](/img/articleContent/IDEASetting/fileEncodings.png)

## 4.滚轴修改字体大小

> idea有默认的字体大小，也可以去设置，但是都不如用ctrl + 鼠标进行实时变大变小来的痛快。

![滚轴修改字体大小](/img/articleContent/IDEASetting/changeFontSizeWithCtrlMouse.png)

## 5.设置显示行号和方法间的分隔符

> idea默认不显示行号，方法之间也没有分隔线，我们可以照如下设置。

![设置显示行号和方法间的分隔符](/img/articleContent/IDEASetting/showLineNumberAndMethodSeparators.png)

设置之后的效果

![设置显示行号和方法间的分隔符](/img/articleContent/IDEASetting/showLineNumberAndMethodSeparatorsAfter.png)

## 6.新建类头注释信息

> 平时项目里都是协作开发，虽然我们在git记录里可以看到代码是谁写的，以及是干什么的。但是我们可以在新建类的时候，让idea自动帮我们生成作者以及描述等信息，这样就很直观的可以看到类的相关信息。

![新建类头注释信息](/img/articleContent/IDEASetting/fileHeaderInNewClass.png)

```
/**
    @desc   ...
    @date ${YEAR}-${MONTH}-${DAY} ${HOUR}:${MINUTE}:${SECOND}
    @author xiaoma
*/
```

我刚新建了个类，我们看下，效果就是这样

![新建类头注释信息](/img/articleContent/IDEASetting/fileHeaderInNewClassAlfter.png)

## 7.JavaDoc注释（就是方法上加的注释）

> 新建类有了注释，新建方法也可以生成注释，因为新建方法设置到参数、返回值等信息，大家照如下设置

![JavaDoc注释](/img/articleContent/IDEASetting/javaDocTemplates.png)

![JavaDoc注释](/img/articleContent/IDEASetting/javaDocTemplates2.png)

```
*
 * @desc $description$
 $params$
 * @return $return$
 *
 * @date $date$ $time$
 * @author xiaoma
 */
```

params的值设置为

```
groovyScript("def result=''; def params=\"${_1}\".replaceAll('[\\\\[|\\\\]|\\\\s]', '').split(',').toList(); for(i = 1; i < params.size() +1; i++) {result+='* @param ' + params[i - 1] + ' ' + i + ((i < params.size()) ? '\\n ' : '')}; return result", methodParameters())
```

使用方法

```
/**+回车
```

我刚新建了个方法，在上面输入/**+回车之后的效果，大家看下

![JavaDoc注释](/img/articleContent/IDEASetting/javaDocTemplatesAlfter.png)

## 8.Terminal中显示git命令行

> idea的控制台默认是不能使用git命令的，这就使得我们很难受，给他设置一手

![Terminal中显示git命令行](/img/articleContent/IDEASetting/terminalGit.png)

```
配置了git中bash.exe的位置后，就可以在Terminal中显示git的命令框(默认是cmd.exe)，并且按Tab可以提示命令
```

**然后出现不能使用ll以及发生中文乱码，解决如下：git路径改成下面这样就可以**

```
# 下面bash路径换成你自己bash的路径

"D:\application\Git\Git\bin\bash.exe" --login -i    
```

![Terminal中显示git命令行](/img/articleContent/IDEASetting/terminalGit2.png)

## 9.取消注释(javadoc:@param)中的检查报错

> 我们方法上@param中参数名如果和方法参数不一致的话，idea默认直接红色报错，大家根据自己需要看要不要取消这个error提示

![取消注释(javadoc:@param)中的检查报错](/img/articleContent/IDEASetting/cancleErrorInJavaDoc.png)

## 10.IDEA中配置数据库

> idea自带的数据库用起来十分友好，我推荐他是因为：它可以在不切换页面进行数据库操作，更重要的是他可以根据列名跳转，这个就比什么sqlYog、Navicat强大多了。说实话，用了她之后，我再也没有用过其他数据库工具。

几个最常用的快捷键

```
Ctrl+Enter             ：执行SQL ，
Ctrl+Alt+E             ：显示最近执行过的SQL （超级实用）
Ctrl+F12 或者 右击列名  ：定位到某行数据后，可以跳转到指定列（超级实用）

```

### 1.新建数据库连接

![新建数据库连接](/img/articleContent/IDEASetting/database1.png)

### 2.配置数据库连接

![配置数据库连接](/img/articleContent/IDEASetting/database2.png)

### 3.页面介绍

![页面介绍](/img/articleContent/IDEASetting/database3.png)

![页面介绍](/img/articleContent/IDEASetting/database4.png)

### 4.查询

![查询](/img/articleContent/IDEASetting/database5.png)

![查询](/img/articleContent/IDEASetting/database6.png)

## 联系博主，加入【羊山丨交流社区】
![联系博主](/img/icon/wechatFindMe.png)