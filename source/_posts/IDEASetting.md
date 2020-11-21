---
title: IDEA的配置(我觉得挺好用的一些配置)
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

今天我就分享一下我自己觉得挺实用的一些配置。

有其他好用配置的朋友，可以在下方留言呦！

## 1：忽略大小写开关

![忽略大小写开关](/img/articleContent/IDEASetting/ignoreMatchCase.png)

## 2：取消单行显示tabs的操作

![取消单行显示tabs的操作](/img/articleContent/IDEASetting/showTabsInOneRow.png)

## 3：项目文件编码

![项目文件编码](/img/articleContent/IDEASetting/fileEncodings.png)

## 4：滚轴修改字体大小

![滚轴修改字体大小](/img/articleContent/IDEASetting/changeFontSizeWithCtrlMouse.png)

## 5：设置显示行号和方法间的分隔符

![设置显示行号和方法间的分隔符](/img/articleContent/IDEASetting/showLineNumberAndMethodSeparators.png)

## 6：新建类头注释信息

![新建类头注释信息](/img/articleContent/IDEASetting/fileHeaderInNewClass.png)

```
/**
    @desc   ...
    @date ${YEAR}-${MONTH}-${DAY} ${HOUR}:${MINUTE}:${SECOND}
    @author xiaoma
*/
```

## 7：JavaDoc注释（就是方法上加的注释）

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

## 8：Terminal中显示git命令行

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

## 9： 取消注释(javadoc:@param)中的检查报错

![取消注释(javadoc:@param)中的检查报错](/img/articleContent/IDEASetting/cancleErrorInJavaDoc.png)

## 10：IDEA中配置数据库

```
Ctrl+Enter             ：执行SQL ，
Ctrl+Alt+E             ：显示最近执行过的SQL （超级实用）
Ctrl+F12 或者 右击列名  ：定位到某行数据后，可以跳转到指定列（超级实用）

```

### 1：新建数据库连接

![新建数据库连接](/img/articleContent/IDEASetting/database1.png)

### 2：配置数据库连接

![配置数据库连接](/img/articleContent/IDEASetting/database2.png)

### 3：页面介绍

![页面介绍](/img/articleContent/IDEASetting/database3.png)

![页面介绍](/img/articleContent/IDEASetting/database4.png)

### 4：查询

![查询](/img/articleContent/IDEASetting/database5.png)

![查询](/img/articleContent/IDEASetting/database6.png)

## 联系博主，加入【羊山丨交流社区】
![联系博主](/img/icon/wechatFindMe.png)