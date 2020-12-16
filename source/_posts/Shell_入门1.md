---
title: Shell_入门1 数据类型和变量
index_img: /img/articleBg/1(28).jpg
banner_img: /img/articleBg/1(28).jpg
tags:
  - Cenos7
  - Shell
category:
  - - 编程
    - Shell
comment: 'off'
date: 2020-12-07 19:23:35
---

今天了解了下shell的基础，赶紧记录一下，怕后面又忘了，哎，老年人，没办法！

<!-- more -->

## 1.字符串

1. 字符串可以使用双引号, 也可以使用单引号, 甚至可以不使用引号

2. 建议使用**双引号**，因为 双引号里面是支持书写变量或者特殊符号的, 而单引号会原生输出

```
name='乔布斯'
str='我很崇拜$name'
str1="我很崇拜$name"
echo $str
echo $str1

我很崇拜$name
我很崇拜 乔布斯
```
### 1.1.拼接字符串
```
#!/bin/bash
yourname="吴恩达"
wenhou_1="你好,$yourname ."
wenhou_2="你好,"$yourname" ."
wenhou_3="你好,\"$yourname\" ."
echo $wenhou_1 $wenhou_2 $wenhou_3

你好,吴恩达 . 你好,吴恩达 . 你好,"吴恩达" .
```

```
#!/bin/bash
yourname="乔布斯"
wenhou_4='你好,$yourname.'
wenhou_5='你好,'$yourname.''
wenhou_6='你好,"$yourname" .'
echo $wenhou_3 $wenhou_4 $wenhou_5

你好,$yourname. 你好,乔布斯. 你好,"$yourname" .
```

### 1.2.拼接字符串

```
#!/bin/bash
string="jobs"
echo ${string}    # 输出结果: jobs
echo ${#string}   # 输出结果: 4
```

### 1.3.提取子字符串

```
#!/bin/bash
string="敢于亮剑决不后退"
echo ${string:2:2}    # 输出结果为: 亮剑
```

### 1.4.查找子字符串

```
#!/bin/bash
string="i am a boy"
echo `expr index "$string" am`    # 输出是: 3
```

## 2.整数

> 1.在shell纯数字的字符串, 一般可以理解为 整数类型

> 2.在书写纯数字的字符串的时候, 一般可以不加 引号

> 3.在shell中 整数不能直接进行运算操作，如果运算，需要用下面的格式

```
#!/bin/bash
#第一种方式
RESULT=$(((2+3)*4))
echo "$RESULT"

#第二种方式(推荐)
RESULT1=$[(2+3)*4]
echo "$RESULT1"

#第三种方式
TEMP=`expr 2 + 3`
RESULT2=`expr $TEMP \* 4`
echo "$RESULT2"

#求出两个参数的和
SUM=$[$1+$2]
echo "$SUM"


./demo.sh 10 20
20
20
20
30
```

## 3.变量

shell中变量分为 **用户变量**、**环境变量**、**静态变量**、**位置参数变量**、**预定义变量** 五种 

### 3.1.变量定义规则

> 1. 变量名可以由字母、数字和下画线组成，但是不能以数字开头。

> 2. 等号两侧不能有空格

> 3. 变量名一般习惯为大写

> 4. 变量值中如果有空格，则需要使用单引号或双引号包含，如 test="hello world!"。双引号括起 来的内容"$"和反引号者都拥有特殊含义，而单引号括起来的内容都是普通字符。

> 5. 在变量值中，可以使用转义符"\"。

> 6. 不能使用bash里的关键字（可用help命令查看保留关键字）。

### 3.2.变量定义

1. 定义变量
```
变量名=变量值
```
2. 撤销变量
```
unset 变量名
```
3. 声明静态变量
```
readonly 变量名=变量值
```

### 3.3.用户变量

```
#!/bin/bash
A=100
echo "A=$A"

unset A
echo "A=$A"

RESULT=`ls -l`
echo "$RESULT"

MY_DATE=$(date)
echo "$MY_DATE"


A=100
A=
总用量 4
-rwxr--r--. 1 root root 240 10月  3 14:25 myShell.sh
2020年 10月 03日 星期六 14:25:41 CST
```

赋值

```
pwd_string=$(pwd) #将当前的绝对路径赋值给pwd_string变量 
date_string=`date`
date_string=`date "+%Y-%m-%d %H:%M:%S"`
#将当前时间赋值给date_string变量 

echo $pwd_string 
echo $date_string 
```

### 3.4.静态变量
```
#!/bin/bash
readonly A=99
echo "A=$A"
unset A
echo "A=$A"

A=99
./myShell.sh: 第 13 行:unset: A: 无法反设定: 只读 variable
A=99
```

### 3.5.环境变量

#### 3.5.1基本语法
```
1. export 变量名=变量值
2. source /etc/profile
3. echo $变量名
```

```
env  #打印所有环境变量
```
#### 3.5.2使用案例
> 在/etc/profile文件中定义TOMCAT_HOME环境变量<br/>
> 查看环境变量TOMCAT_HOME的值<br/>
> 在另外一个shell程序中使用TOMCAT_HOME
```
vim /etc/profile

#定义一个自己的环境变量
TOMCAT_HOME=/opt
export "TOMCAT_HOME"

source /etc/profile

echo $TOMCAT_HOME
```

### 3.6.位置参数变量

![位置参数变量](/img/articleContent/shellBasic/shellBasic1.png)

```
#获取各个参数
echo "$0 $1 $2"
echo "$*"
echo "$@"
echo "参数个数=$#"

执行./positionPara.sh 30 60

./positionPara.sh 30 60
30 60
30 60
参数个数=2
```

### 3.7.预定义变量

![预定义变量](/img/articleContent/shellBasic/shellBasic2.png)

```
#!/bin/bash
echo "当前的进程号=$$"
#后台的方式运行 myShell.sh
./myShell.sh &
echo "最后的进程编号=$!"
echo "执行的值=$?"

当前的进程号=42507
最后的进程编号=42508
执行的值=0
```

## 4.read读取

![read读取控制台输入](/img/articleContent/shellBasic/shellBasic3.png)

```
#!/bin/bash
read -p "请输入一个数num1=" NUM1
echo "你输入的值是 num1=$NUM1"

read -t 10 -p "请输入一个数num2=" NUM2
echo "你输入的值是 num2=$NUM2"


请输入一个数num1=100
你输入的值是 num1=100
请输入一个数num2=200
你输入的值是 num2=200   (10s内不输入的话，这里打印num2=)
```

## 联系博主，加入【羊山丨交流社区】
![联系博主](/img/icon/wechatFindMe.png)

