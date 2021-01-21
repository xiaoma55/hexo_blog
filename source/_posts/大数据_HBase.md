---
title: HBase 分布式可扩展大数据存储
index_img: /img/articleBg/1(51).jpg
banner_img: /img/articleBg/1(51).jpg
tags:
  - 大数据
  - Hadoop
  - HBase
category:
  - - 编程
    - 大数据
comment: 'off'
date: 2021-01-18 16:26:05
---

Apache HBase™是Hadoop数据库，这是一个`分布式`，`可扩展`的`大数据存储`。

当您需要对`大数据`进行`随机，实时的读/写访问`时，请使用Apache HBase™。

该项目的目标是在商品硬件群集上托管非常大的表（数十亿行X数百万列）。

Apache HBase是一种`开放源`，`分布式`，`版本化`，`非关系型`数据库，其仿照Chang等人的Google的Bigtable：结构化数据的分布式存储系统。

正如Bigtable利用Google文件系统提供的`分布式数据存储`一样，Apache HBase在Hadoop和HDFS之上提供类似于Bigtable的功能。

<!-- more -->

## 1 简介

### 1.1 Hadoop

> 从 1970 年开始，大多数的公司数据存储和维护使用的是关系型数据库。<br/>
大数据技术出现后，很多拥有海量数据的公司开始选择像Hadoop的方式来存储海量数据。<br/>
Hadoop使用分布式文件系统HDFS来存储海量数据，并使用 MapReduce 来处理。Hadoop擅长于存储各种格式的庞大的数据，任意的格式甚至非结构化的处理

### 1.2 Hadoop的局限

> Hadoop主要是实现批量数据的处理，并且通过顺序方式访问数据。<br/>
要查找数据必须搜索整个数据集， 如果要进行随机读取数据，效率较低(压根就不支持)

### 1.3 HBase与NoSQL

> NoSQL是一个通用术语，泛指一个数据库并不是使用SQL作为主要语言的非关系型数据库。<br/>
HBase是BigTable的开源java版本。是建立在HDFS之上，提供高可靠性、高性能、列存储、可伸缩、实时读写NoSQL的数据库系统。<br/>
HBase仅能通过主键(row key)和主键的range来检索数据，仅支持单行事务。<br/>
主要用来存储结构化和半结构化的松散数据。<br/>
Hbase查询数据功能很简单，不支持join等复杂操作，不支持复杂的事务（行级的事务），从技术上来说，HBase更像是一个「数据存储」而不是「数据库」，因为HBase缺少RDBMS中的许多特性，例如带类型的列、二级索引以及高级查询语言等。<br/>
Hbase中支持的数据类型：byte[]。<br/>
与Hadoop一样，Hbase目标主要依靠横向扩展，通过不断增加廉价的商用服务器，来增加存储和处理能力，例如，把集群从10个节点扩展到20个节点，存储能力和处理能力都会加倍。<br/>
HBase中的表一般有这样的特点。
> 
```
大：一个表可以有上十亿行，上百万列
面向列:面向列(族)的存储和权限控制，列(族)独立检索
稀疏:对于为空(null)的列，并不占用存储空间，因此，表可以设计的非常稀疏
```

### 1.4 HBase应用场景

#### 1.4.1 `对象存储`

> 不少的头条类、新闻类的的新闻、网页、图片存储在HBase之中，一些病毒公司的病毒库也是存储在HBase之中

#### 1.4.2 `时序数据`

> HBase之上有OpenTSDB模块，可以满足时序类场景的需求

#### 1.4.3 `推荐画像`

> 用户画像，是一个比较大的稀疏矩阵，蚂蚁金服的风控就是构建在HBase之上

#### 1.4.4 `时空数据`

> 主要是轨迹、气象网格之类，滴滴打车的轨迹数据主要存在HBase之中，另外在技术所有大一点的数据量的车联网企业，数据都是存在HBase之中

#### 1.4.5 `CubeDB OLAP`

> Kylin一个cube分析工具，底层的数据就是存储在HBase之中，不少客户自己基于离线计算构建cube存储在hbase之中，满足在线报表查询的需求

#### 1.4.6 `消息/订单`

> 在电信领域、银行领域，不少的订单查询底层的存储，另外不少通信、消息同步的应用构建在HBase之上

#### 1.4.7 `Feeds流`

> 典型的应用就是xx朋友圈类似的应用，用户可以随时发布新内容，评论、点赞。

#### 1.4.8 `NewSQL`

> 之上有Phoenix的插件，可以满足二级索引、SQL的需求，对接传统数据需要SQL非事务的需求

#### 1.4.9 `其他`

> 存储爬虫数据<br/>
> 海量数据备份<br/>
> 短网址

### 1.5 发展历程

年份 | 重大事件
---|---
2006年11月 | Google发布BigTable论文.
2007年10月 | 发布第一个可用的HBase版本，基于Hadoop 0.15.0.
2008年1月 | HBase称为Hadoop的一个子项目.
2010年5月 | HBase称为Apache的顶级项目.

### 1.6 HBase特点

`强一致性读/写`

> HBASE不是“最终一致的”数据存储<br/>
它非常适合于诸如高速计数器聚合等任务

`自动分块`

> HBase表通过Region分布在集群上，随着数据的增长，区域被自动拆分和重新分布

`自动RegionServer故障转移`

`Hadoop/HDFS集成`

`HBase支持HDFS开箱即用作为其分布式文件系统`

`MapReduce`

> HBase通过MapReduce支持大规模并行处理，将HBase用作源和接收器

`Java Client API`

> HBase支持易于使用的 Java API 进行编程访问

`Thrift/REST API`  

`块缓存和布隆过滤器`

> HBase支持块Cache和Bloom过滤器进行大容量查询优化

`运行管理`

> HBase为业务洞察和JMX度量提供内置网页。

### 1.7 RDBMS与HBase的对比

#### 1.7.1 关系型数据库

##### 1.7.1.1 结构

> 数据库以表的形式存在<br/>
支持FAT、NTFS、EXT、文件系统<br/>
使用主键（PK）<br/>
通过外部中间件可以支持分库分表，但底层还是单机引擎<br/>
使用行、列、单元格

##### 1.7.1.2 功能

> 支持向上扩展（买更好的服务器）<br/>
使用SQL查询<br/>
面向行，即每一行都是一个连续单元<br/>
数据总量依赖于服务器配置<br/>
具有ACID支持<br/>
适合结构化数据<br/>
传统关系型数据库一般都是中心化的<br/>
支持事务<br/>
支持Join

#### 1.7.2 HBase

##### 1.7.2.1 结构

> 以表形式存在<br/>
支持HDFS文件系统<br/>
使用行键（row key）<br/>
原生支持分布式存储、计算引擎<br/>
使用行、列、列族和单元格

##### 1.7.2.2 功能

> 支持向外扩展<br/>
使用API和MapReduce、Spark、Flink来访问HBase表数据<br/>
面向列蔟，即每一个列蔟都是一个连续的单元<br/>
数据总量不依赖具体某台机器，而取决于机器数量<br/>
HBase不支持ACID（Atomicity、Consistency、Isolation、Durability）<br/>
适合结构化数据和非结构化数据<br/>
一般都是分布式的<br/>
HBase不支持事务，支持的是单行数据的事务操作<br/>
不支持Join

### 1.8 HDFS对比HBase

#### 1.8.1 HDFS

> HDFS是一个非常适合存储大型文件的分布式文件系统<br/>
HDFS它不是一个通用的文件系统，也无法在文件中快速查询某个数据

#### 1.8.2 HBase

> HBase构建在HDFS之上，并为大型表提供快速记录查找(和更新)<br/> 
HBase内部将大量数据放在HDFS中名为「StoreFiles」的索引中，以便进行高速查找<br/>
Hbase比较适合做快速查询等需求，而不适合做大规模的OLAP应用

### 1.9 Hive对比HBase

#### 1.9.1 Hive

> 数据仓库工具

Hive的本质其实就相当于将HDFS中已经存储的文件在Mysql中做了一个双射关系，以方便使用HQL去管理查询

> 用于数据分析、清洗

Hive适用于离线的数据分析和清洗，延迟较高

> 基于HDFS、MapReduce
> 
Hive存储的数据依旧在DataNode上，编写的HQL语句终将是转换为MapReduce代码执行

#### 1.9.2 HBase

> NoSQL数据库

是一种面向列存储的非关系型数据库。

> 用于存储结构化和非结构化的数据

适用于单表非关系型数据的存储，不适合做关联查询，类似JOIN等操作。

> 基于HDFS

数据持久化存储的体现形式是Hfile，存放于DataNode中，被ResionServer以region的形式进行管理

> 延迟较低，接入在线业务使用

面对大量的企业数据，HBase可以直线单表大量数据的存储，同时提供了高效的数据访问速度

#### 1.9.3 总结Hive与HBase

> Hive和Hbase是两种基于Hadoop的不同技术<br/> 
Hive是一种类SQL的引擎，并且运行MapReduce任务<br/>
Hbase是一种在Hadoop之上的NoSQL 的Key/value数据库<br/>
这两种工具是可以同时使用的。就像用Google来搜索，用FaceBook进行社交一样，Hive可以用来进行统计查询，HBase可以用来进行实时查询，数据也可以从Hive写到HBase，或者从HBase写回Hive

## 2 集群搭建

### 2.1 安装

#### 2.1.1 上传解压HBase安装包

```
tar -xvzf hbase-2.1.0.tar.gz -C ../servers/
```

#### 2.1.2 修改HBase配置文件

##### 2.1.2.1 hbase-env.sh

```
cd /export/servers/hbase-2.1.0/conf
vim hbase-env.sh
# 第28行
export JAVA_HOME=/export/servers/jdk1.8.0_241/
export HBASE_MANAGES_ZK=false
```

##### 2.1.2.2 hbase-site.xml

```
vim hbase-site.xml
------------------------------
<configuration>
        <!-- HBase数据在HDFS中的存放的路径 -->
        <property>
            <name>hbase.rootdir</name>
            <value>hdfs://node1.xiaoma.cn:8020/hbase</value>
        </property>
        <!-- Hbase的运行模式。false是单机模式，true是分布式模式。若为false,Hbase和Zookeeper会运行在同一个JVM里面 -->
        <property>
            <name>hbase.cluster.distributed</name>
            <value>true</value>
        </property>
        <!-- ZooKeeper的地址 -->
        <property>
            <name>hbase.zookeeper.quorum</name>
            <value>node1.xiaoma.cn,node2.xiaoma.cn,node3.xiaoma.cn</value>
        </property>
        <!-- ZooKeeper快照的存储位置 -->
        <property>
            <name>hbase.zookeeper.property.dataDir</name>
            <value>/export/servers/apache-zookeeper-3.6.0-bin/data</value>
        </property>
        <!--  V2.1版本，在分布式情况下, 设置为false -->
        <property>
            <name>hbase.unsafe.stream.capability.enforce</name>
            <value>false</value>
        </property>
</configuration>
```

#### 2.1.3 配置环境变量

```
# 配置Hbase环境变量
vim /etc/profile
export HBASE_HOME=/export/servers/hbase-2.1.0
export PATH=$PATH:${HBASE_HOME}/bin:${HBASE_HOME}/sbin

#加载环境变量
source /etc/profile
```

#### 2.1.4 复制jar包到lib

```
cp $HBASE_HOME/lib/client-facing-thirdparty/htrace-core-3.1.0-incubating.jar $HBASE_HOME/lib/
```

#### 2.1.5 修改regionservers文件

```
vim regionservers 
node1.xiaoma.cn
node2.xiaoma.cn
node3.xiaoma.cn
```

#### 2.1.6 分发安装包与配置文件

```
cd /export/servers
scp -r hbase-2.1.0/ node2.xiaoma.cn:$PWD
scp -r hbase-2.1.0/ node3.xiaoma.cn:$PWD

#配置文件不建议这么改，自己手动去2号机和3号机改一下
scp -r /etc/profile node2.xiaoma.cn:/etc
scp -r /etc/profile node3.xiaoma.cn:/etc

在node2.xiaoma.cn和node3.xiaoma.cn配置加载环境变量
source /etc/profile
```

#### 2.1.7 启动HBase

> 启动ZK，三台服务器都执行

```
cd /export/servers/zookeeper-3.4.6/bin
./zkServer.sh start
./zkServer.sh status #查看启动状态，一个leader，两个follower就好了
```

> 启动hadoop

```
start-all.sh
jps 
```
查看启动成功没有,具体{% post_link 大数据_Hadoop集群搭建 去hadoop那篇文章看 %}
> 启动hbase

```
start-hbase.sh  
#要是中间报警告说连不到其他主机之类的，就先stop-hbase.sh，然后ssh node1.xiaoma.cn,ssh node2.xiaoma.cn,ssh node3.xiaoma.cn,ssh node1.xiaoma.cn，再去执行start-hbase.sh就好了
```

![启动hbase](/img/articleContent/大数据_HBase/1.png)

#### 2.1.8 验证Hbase是否启动成功

> 启动hbase shell客户端

```
hbase shell
```

> 输入status

```
[root@node1 onekey]# hbase shell
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/export/servers/hadoop-2.7.5/share/hadoop/common/lib/slf4j-log4j12-1.7.10.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/export/servers/hbase-2.1.0/lib/client-facing-thirdparty/slf4j-log4j12-1.7.25.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.slf4j.impl.Log4jLoggerFactory]
HBase Shell
Use "help" to get list of supported commands.
Use "exit" to quit this interactive shell.
Version 2.1.0, re1673bb0bbfea21d6e5dba73e013b09b8b49b89b, Tue Jul 10 17:26:48 CST 2018
Took 0.0034 seconds                                                                                                                                           
Ignoring executable-hooks-1.6.0 because its extensions are not built. Try: gem pristine executable-hooks --version 1.6.0
Ignoring gem-wrappers-1.4.0 because its extensions are not built. Try: gem pristine gem-wrappers --version 1.4.0
2.4.1 :001 > status
1 active master, 0 backup masters, 3 servers, 0 dead, 0.6667 average load
Took 0.4562 seconds                                                                                                                                           
2.4.1 :002 >
```

报错的话可以去日志/export/servers/hbase-2.1.0/logs里查看具体的报错信息，里面有master和regionserver的日志

![验证Hbase是否启动成功](/img/articleContent/大数据_HBase/2.png)

### 2.2 [WebUI](http://node1.xiaoma.cn:16010/master-status)

http://node1.xiaoma.cn:16010/master-status

![WebUI验证](/img/articleContent/大数据_HBase/3.png)

### 2.3 安装目录说明

目录名 | 说明
--- | ---
bin | 所有hbase相关的命令都在该目录存放
conf | 所有的hbase配置文件
hbase-webapps | hbase的web ui程序位置
lib | hbase依赖的java库
logs | hbase的日志文件

### 2.4 参考硬件配置

> 针对大概800TB存储空间的集群中每个Java进程的典型内存配置：

进程 | 堆 | 描述
--- | --- | --- 
NameNode | 8 GB | 每100TB数据或每100W个文件大约占用NameNode堆1GB的内存
SecondaryNameNode | 8GB | 在内存中重做主NameNode的EditLog，因此配置需要与NameNode一样
DataNode | 1GB | 适度即可
ResourceManager | 4GB | 适度即可（注意此处是MapReduce的推荐配置）
NodeManager | 2GB | 适当即可（注意此处是MapReduce的推荐配置）
HBase HMaster | 4GB | 轻量级负载，适当即可
HBase RegionServer | 12GB | 大部分可用内存、同时为操作系统缓存、任务进程留下足够的空间
ZooKeeper | 1GB | 适度

推荐：

> Master机器要运行NameNode、ResourceManager、以及HBase HMaster，推荐24GB左右<bn/>
Slave机器需要运行DataNode、NodeManager和HBase RegionServer，推荐24GB（及以上）<bn/>
根据CPU的核数来选择在某个节点上运行的进程数，例如：两个4核CPU=8核，每个Java进程都可以独立占有一个核（推荐：8核CPU）<bn/>
内存不是越多越好，在使用过程中会产生较多碎片，Java堆内存越大， 会导致整理内存需要耗费的时间越大。例如：给RegionServer的堆内存设置为64GB就不是很好的选择，一旦FullGC就会造成较长时间的等待，而等待较长，Master可能就认为该节点已经挂了，然后移除掉该节点

## 3 HBase数据模型

### 3.1 简介

> 在HBASE中，数据存储在具有行和列的表中。这是看起来关系数据库(RDBMS)一样，但将HBASE表看成是多个维度的Map结构更容易理解。

![HBase数据模型简介](/img/articleContent/大数据_HBase/4.png)

```
{
  "zzzzz" : "woot",
  "xyz" : "hello",@
  "aaaab" : "world",
  "1" : "x",
  "aaaaa" : "y"
}
```

### 3.2 术语

#### 3.2.1 表（Table）

> HBase中数据都是以表形式来组织的<br/>
HBase中的表由多个行组成

在HBase WebUI（http://node1.xiaoma.cn:16010中可以查看到目前HBase中的表）

![表](/img/articleContent/大数据_HBase/5.png)

#### 3.2.2 行键（row key）

> HBASE中的行由一个rowkey（行键）和一个或多个列组成，列的值与rowkey、列相关联<br/>
行在存储时按行键按字典顺序排序<br/>
行键的设计非常重要，尽量让相关的行存储在一起

> 例如：存储网站域。如行键是域，则应该将域名反转后存储(org.apache.www、org.apache.mail、org.apache.jira)。这样，所有Apache域都在表中存储在一起，而不是根据子域的第一个字母展开

> 后续，我们会讲解rowkey的设计策略。

#### 3.2.3 列（Column）

> HBASE中的列由列族（Column Family）和列限定符（Column Qualifier）组成<br/>
表示如下——列族名:列限定符名。例如：C1:USER_ID、C1:SEX

#### 3.2.4 列族（Column Family）

![列族（Column Family）](/img/articleContent/大数据_HBase/6.png)

> 出于性能原因，列族将一组列及其值组织在一起<br/>
每个列族都有一组存储属性，例如：

是否应该缓存在内存中

数据如何被压缩或行键如何编码等
> 表中的每一行都有相同的列族，但在列族中不存储任何内容<br/>
所有的列族的数据全部都存储在一块（文件系统HDFS）<br/>
HBase官方建议所有的列蔟保持一样的列，并且将同一类的列放在一个列蔟中

#### 3.2.5 列标识符（Column Qualifier）

> 列族中包含一个个的列限定符，这样可以为存储的数据提供索引<br/>
列族在创建表的时候是固定的，但列限定符是不作限制的<br/>
不同的行可能会存在不同的列标识符

#### 3.2.6 单元格（Cell）

> 单元格是行、列系列和列限定符的组合<br/>
包含一个值和一个时间戳（表示该值的版本）<br/>
单元格中的内容是以二进制存储的

ROW | COLUMN+CELL
--- | ---
1250995 | column=C1:ADDRESS, timestamp=1588591604729, value=\xC9\xBD\xCE\xF7\xCA
1250995 | column=C1:LATEST_DATE, timestamp=1588591604729, value=2019-03-28
1250995 | column=C1:NAME, timestamp=1588591604729, value=\xB7\xBD\xBA\xC6\xD0\xF9
1250995 | column=C1:NUM_CURRENT, timestamp=1588591604729, value=398.5
1250995 | column=C1:NUM_PREVIOUS, timestamp=1588591604729, value=379.5
1250995 | column=C1:NUM_USEAGE, timestamp=1588591604729, value=19
1250995 | column=C1:PAY_DATE, timestamp=1588591604729, value=2019-02-26
1250995 | column=C1:RECORD_DATE, timestamp=1588591604729, value=2019-02-11
1250995 | column=C1:SEX, timestamp=1588591604729, value=\xC5\xAE
1250995 | column=C1:TOTAL_MONEY, timestamp=1588591604729, value=114

### 3.3 概念模型

Row Key | Time Stamp | ColumnFamily contents | ColumnFamily anchor | ColumnFamily people
--- | --- | --- | --- | ---
"com.cnn.www" | t9 |  | anchor:cnnsi.com = "CNN"	 |
"com.cnn.www" | t8 |  | anchor:my.look.ca = "CNN.com" | 
"com.cnn.www" | t6 | contents:html = "<html>…​" |  | 
"com.cnn.www" | t5 | contents:html = "<html>…​" |  | 
"com.cnn.www" | t3 | contents:html = "<html>…​" |  | 
"com.example.www" | t5 | contents:html = "<html>…​" |  | people:author = "John Doe"

> 上述表格有两行、三个列族（contens、ancho、people）<br/>
“com.cnn.www”这一行anchor列族两个列（anchor:cssnsi.com、anchor:my.look.ca）、contents列族有个1个列（html）<br/>
“com.cnn.www”在HBase中有 t3、t5、t6、t8、t9 5个版本的数据<br/>
HBase中如果某一行的列被更新的，那么最新的数据会排在最前面，换句话说同一个rowkey的数据是按照倒序排序的

## 4 常用shell操作

> 我们可以以shell的方式来维护和管理HBase。例如：执行建表语句、执行增删改查操作等等。

### 4.1 需求

> 有以下订单数据，我们想要将这样的一些数据保存到HBase中。

订单ID | 订单状态 | 支付金额 | 支付方式ID | 用户ID | 操作时间 | 商品分类 
--- | --- |--- |--- |--- |--- | --- |
001 | 已付款 | 200.5 | 1 | 001 | 2020-5-2 | 18:08:53 | 手机

> 接下来，我们将使用HBase shell来进行以下操作：

1. 创建表
2. 添加数据
3. 更新数据
4. 删除数据
5. 查询数据

### 4.2 创建表

> 在HBase中，所有的数据也都是保存在表中的。要将订单数据保存到HBase中，首先需要将表创建出来。

#### 4.2.1 启动HBase Shell

HBase的shell其实JRuby的IRB（交互式的Ruby），但在其中添加了一些HBase的命令。

启动HBase shell：

```
hbase shell
```

#### 4.2.2 创建表

语法：
```
create '表名','列蔟名'...
```

创建订单表，表名为ORDER_INFO，该表有一个列蔟为C1

```
create 'ORDER_INFO','C1';
```

注意：
> create要写成小写<br/>
一个表可以包含若干个列蔟<br/>
命令解析：调用hbase提供的ruby脚本的create方法，传递两个字符串参数<br/>
通过下面链接可以看到每个命令都是一个ruby脚本

https://github.com/apache/hbase/tree/branch-2.1/hbase-shell/src/main/ruby/shell/commands

#### 4.2.3 查看表

```
hbase(main):005:0> list
TABLE                                                                                                                                                                    
ORDER_INFO                                                                                                                                                               
1 row(s)
Took 0.0378 seconds                                                                                                                                                      
=> ["ORDER_INFO"]
```

#### 4.2.4 删除表

> 要删除某个表，必须要先禁用表

##### 4.2.4.1 禁用表

> 语法：disable "表名"

##### 4.2.4.2 删除表

> 语法：drop "表名"

##### 4.2.4.3 删除ORDER_INFO表

```
disable "ORDER_INFO"
drop "ORDER_INFO"
```

### 4.3 添加数据

#### 4.3.1 需求

> 接下来，我们需要往订单表中添加以下数据。

订单ID | 订单状态 | 支付金额 | 支付方式ID | 用户ID | 操作时间 | 商品分类
--- | --- | --- | --- | --- | --- | ---
ID | STATUS | PAY_MONEY | PAYWAY | USER_ID | OPERATION_DATE | CATEGORY
000001 | 已提交 | 1 | 4944191 | 2020-04-25 | 12:09:16 | 手机

#### 4.3.2 PUT操作

> HBase中的put命令，可以用来将数据保存到表中。但put一次只能保存一个列的值。以下是put的语法结构：

```
put '表名','ROWKEY','列蔟名:列名','值'
```

> 要添加以上的数据，需要使用7次put操作。如下：

```
put 'ORDER_INFO','000001','C1:ID','000001'
put 'ORDER_INFO','000001','C1:STATUS','已提交'
put 'ORDER_INFO','000001','C1:PAY_MONEY',4070
put 'ORDER_INFO','000001','C1:PAYWAY',1
put 'ORDER_INFO','000001','C1:USER_ID',4944191
put 'ORDER_INFO','000001','C1:OPERATION_DATE','2020-04-25 12:09:16'
put 'ORDER_INFO','000001','C1:CATEGORY','手机;'
```

### 4.4 查看添加的数据

#### 4.4.1 需求

> 要求将rowkey为：000001对应的数据查询出来。

#### 4.4.2 get命令

> 在HBase中，可以使用get命令来获取单独的一行数据。语法：

```
get '表名','rowkey'
```

#### 4.4.3 查询指定订单ID的数据

> get 'ORDER_INFO','000001'

COLUMN | CELL
--- | ---
C1:CATEGORY | timestamp=1588415690678, value=\xE6\x89\x8B\xE6\x9C\xBA;             
C1:OPERATION_DATE | timestamp=1588415689773, value=2020-04-25 12:09:16                   
C1:PAYWAY | timestamp=1588415689681, value=1                                     
C1:PAY_MONEY | timestamp=1588415689643, value=4070                                  
C1:STATUS | timestamp=1588415689591, value=\xE5\xB7\xB2\xE6\x8F\x90\xE4\xBA\xA4  
C1:USER_ID | timestamp=1588415689721, value=4944191

#### 4.4.4 显示中文

> 在HBase shell中，如果在数据中出现了一些中文，默认HBase shell中显示出来的是十六进制编码。要想将这些编码显示为中文，我们需要在get命令后添加一个属性：{FORMATTER => 'toString'}

##### 4.4.4.1

```
get 'ORDER_INFO','000001', {FORMATTER => 'toString'}
```


> { key => value}，这个是Ruby语法，表示定义一个HASH结构<br/>
get是一个HBase Ruby方法，’ORDER_INFO’、’000001’、{FORMATTER => 'toString'}是put方法的三个参数<br/>
FORMATTER要使用大写<br/>
在Ruby中用{}表示一个字典，类似于hashtable，FORMATTER表示key、’toString’表示值

### 4.5 更新操作

#### 4.5.1 需求

> 将订单ID为000001的状态，更改为「已付款」

#### 4.5.2 使用put来更新数据

> 同样，在HBase中，也是使用put命令来进行数据的更新，语法与之前的添加数据一模一样。

#### 4.5.3 更新指定的列

```
put 'ORDER_INFO', '000001', 'C1:STATUS', '已付款'
```

> HBase中会自动维护数据的版本<br/>
每当执行一次put后，都会重新生成新的时间戳

```
C1:STATUS   timestamp=1588748844082, value=已提交
C1:STATUS   timestamp=1588748952074, value=已付款
C1:STATUS   timestamp=1588748994244, value=已付款
```

### 4.6 删除操作

#### 4.6.1 删除状态列数据

##### 4.6.1.1 需求

> 将订单ID为000001的状态列删除。

##### 4.6.1.2 delete命令

> 在HBase中，可以使用delete命令来将一个单元格的数据删除。语法格式如下：

```
delete '表名', 'rowkey', '列蔟:列'
```

注意：此处HBase默认会保存多个时间戳的版本数据，所以这里的delete删除的是最新版本的列数据。

##### 4.6.1.3 删除指定的列

```
delete 'ORDER_INFO','000001','C1:STATUS'
```

#### 4.6.2 删除整行数据

##### 4.6.2.1 需求

> 将订单ID为000001的信息全部删除（删除所有的列）

##### 4.6.2.2 deleteall命令

> deleteall命令可以将指定rowkey对应的所有列全部删除。语法：

```
deleteall '表名','rowkey'
```

##### 4.6.2.3 删除指定的订单

```
deleteall 'ORDER_INFO','000001'
```

#### 4.6.3 清空表

##### 4.6.3.1 需求

> 将ORDER_INFO的数据全部删除

##### 4.6.3.2 truncate命令

> truncate命令用来清空某个表中的所有数据。语法：

```
truncate "表名"
```

##### 4.6.3.3 清空ORDER_INFO的所有数据

```
truncate 'ORDER_INFO'
```

### 4.7 导入测试数据集

#### 4.7.1 需求

> 在资料的 数据集/ ORDER_INFO.txt 中，有一份这样的HBase数据集，我们需要将这些指令放到HBase中执行，将数据导入到HBase中。

> 可以看到这些都是一堆的put语句。那么如何才能将这些语句全部执行呢？

![需求](/img/articleContent/大数据_HBase/7.png)

#### 4.7.2 执行command文件

##### 4.7.2.1 上传command文件

> 将该数据集文件上传到指定的目录中

##### 4.7.2.2 执行

使用以下命令执行：即可。

```
hbase shell /export/software/ORDER_INFO.txt
```

### 4.8 计数操作

#### 4.8.1 需求

> 查看HBase中的ORDER_INFO表，一共有多少条记录。

#### 4.8.2 count命令

> count命令专门用来统计一个表中有多少条数据。语法：

```
count ‘表名’
```

注意：这个操作是比较耗时的。在数据量大的这个命令可能会运行很久。

#### 4.8.3 获取订单数据

```
count 'ORDER_INFO'
```

### 4.9 大量数据的计数统计

当HBase中数据量大时，可以使用HBase中提供的MapReduce程序来进行计数统计。语法如下：

```
$HBASE_HOME/bin/hbase org.apache.hadoop.hbase.mapreduce.RowCounter '表名'
```

#### 4.9.1 启动YARN集群

> 启动yarn集群

```
start-yarn.sh
```

> 启动history server

```
mr-jobhistory-daemon.sh start historyserver
```

#### 4.9.2 执行MR JOB

```
$HBASE_HOME/bin/hbase org.apache.hadoop.hbase.mapreduce.RowCounter 'ORDER_INFO'
```

> 通过观察YARN的WEB UI，我们发现HBase启动了一个名字为rowcounter_ORDER_INFO的作业。

![执行MR JOB](/img/articleContent/大数据_HBase/8.png)

### 4.10 扫描操作

#### 4.10.1 需求一：查询订单所有数据

##### 4.10.1.1 需求

> 查看ORDER_INFO表中所有的数据

##### 4.10.1.2 scan命令

> 在HBase，我们可以使用scan命令来扫描HBase中的表。语法：

```
scan '表名'
```

##### 4.10.1.3 扫描ORDER_INFO表

```
scan 'ORDER_INFO',{FORMATTER => 'toString'}
```

注意：要避免scan一张大表！

#### 4.10.2 需求二：查询订单数据（只显示3条）

```
scan 'ORDER_INFO', {LIMIT => 3, FORMATTER => 'toString'}
```

#### 4.10.3 需求三：查询订单状态、支付方式

##### 4.10.3.1 需求

> 只查询订单状态以及支付方式，并且只展示3条数据

##### 4.10.3.2 命令

```
scan 'ORDER_INFO', {LIMIT => 3, COLUMNS => ['C1:STATUS', 'C1:PAYWAY'], FORMATTER => 'toString'}
```

注意：[‘C1:STATUS’, …]在Ruby中[]表示一个数组

#### 4.10.4 需求四：查询指定订单ID的数据并以中文展示

> 根据ROWKEY来查询对应的数据，ROWKEY为02602f66-adc7-40d4-8485-76b5632b5b53，只查询订单状态、支付方式，并以中文展示。

>要查询指定ROWKEY的数据，需要使用ROWPREFIXFILTER，用法为：

```
scan '表名', {ROWPREFIXFILTER => 'rowkey'}
```

> 实现指令：

```
scan 'ORDER_INFO', {ROWPREFIXFILTER => '02602f66-adc7-40d4-8485-76b5632b5b53', COLUMNS => ['C1:STATUS', 'C1:PAYWAY'], FORMATTER => 'toString'}
```

### 4.11 过滤器

#### 4.11.1 简介

> 在HBase中，如果要对海量的数据来进行查询，此时基本的操作是比较无力的。此时，需要借助HBase中的高级语法——Filter来进行查询。Filter可以根据列簇、列、版本等条件来对数据进行过滤查询。因为在HBase中，主键、列、版本都是有序存储的，所以借助Filter，可以高效地完成查询。当执行Filter时，HBase会将Filter分发给各个HBase服务器节点来进行查询。

> HBase中的过滤器也是基于Java开发的，只不过在Shell中，我们是使用基于JRuby的语法来实现的交互式查询。以下是HBase 2.2的JAVA API文档。

#### 4.11.2 HBase中的过滤器

> 在HBase的shell中，通过show_filters指令，可以查看到HBase中内置的一些过滤器。

```
hbase(main):028:0> show_filters
DependentColumnFilter                                                                                                                                                       
KeyOnlyFilter                                                                                                                                                               
ColumnCountGetFilter                                                                                                                                                        
SingleColumnValueFilter                                                                                                                                                     
PrefixFilter                                                                                                                                                                
SingleColumnValueExcludeFilter                                                                                                                                              
FirstKeyOnlyFilter                                                                                                                                                          
ColumnRangeFilter                                                                                                                                                           
ColumnValueFilter                                                                                                                                                           
TimestampsFilter                                                                                                                                                            
FamilyFilter                                                                                                                                                                
QualifierFilter                                                                                                                                                             
ColumnPrefixFilter                                                                                                                                                          
RowFilter                                                                                                                                                                   
MultipleColumnPrefixFilter                                                                                                                                                  
InclusiveStopFilter                                                                                                                                                         
PageFilter                                                                                                                                                                  
ValueFilter                                                                                                                                                                 
ColumnPaginationFilter
```
![HBase中的过滤器](/img/articleContent/大数据_HBase/9.png)

[Java API官方地址](https://hbase.apache.org/devapidocs/index.html)：https://hbase.apache.org/devapidocs/index.html

#### 4.11.3 过滤器的用法

> 过滤器一般结合scan命令来使用。打开HBase的JAVA API文档。找到RowFilter的构造器说明，我们来看以下，HBase的过滤器该如何使用。

```
scan '表名', { Filter => "过滤器(比较运算符, '比较器表达式')" }
```

##### 4.11.3.1 比较运算符

比较运算符 | 描述
---|---
= | 等于
> | 大于
>= | 大于等于
< | 小于
<= | 小于等于
!= | 不等于

##### 4.11.3.2 比较器
比较器 | 描述
---|---
BinaryComparator | 匹配完整字节数组
BinaryPrefixComparator | 匹配字节数组前缀
BitComparator | 匹配比特位
NullComparator | 匹配空值
RegexStringComparator | 匹配正则表达式
SubstringComparator | 匹配子字符串

##### 4.11.3.3 比较器表达式

> 基本语法：比较器类型:比较器的值

比较器 | 表达式语言缩写
---|---
BinaryComparator | binary:值
BinaryPrefixComparator | binaryprefix:值
BitComparator | bit:值
NullComparator | null
RegexStringComparator | regexstring:正则表达式
SubstringComparator | substring:值

#### 4.11.4 需求一：使用RowFilter查询指定订单ID的数据

##### 4.11.4.1 需求

> 只查询订单的ID为：02602f66-adc7-40d4-8485-76b5632b5b53、订单状态以及支付方式

分析

> 1.因为要订单ID就是ORDER_INFO表的rowkey，所以，我们应该使用rowkey过滤器来过滤<br/>
2.通过HBase的JAVA API，找到RowFilter构造器

![需求](/img/articleContent/大数据_HBase/10.png)

> 通过上图，可以分析得到，RowFilter过滤器接受两个参数，

> op——比较运算符<br/>
rowComparator——比较器

> 所以构建该Filter的时候，只需要传入两个参数即可

##### 4.11.4.2 命令

#### 4.11.5 需求二：查询状态为已付款的订单

##### 4.11.5.1 需求

> 查询状态为「已付款」的订单

分析

> 1.因为此处要指定列来进行查询，所以，我们不再使用rowkey过滤器，而是要使用列过滤器<br/>
2.我们要针对指定列和指定值进行过滤，比较适合使用SingleColumnValueFilter过滤器，查看JAVA API

需要传入四个参数：
> 列簇<br/>
列标识（列名）<br/>
比较运算符<br/>
比较器

注意：

> `列名STATUS的大小写一定要对！此处使用的是大写！`<br/>
`列名写错了查不出来数据，但HBase不会报错，因为HBase是无模式的`

##### 4.11.5.2 命令

```
scan 'ORDER_INFO', {FILTER => "SingleColumnValueFilter('C1', 'STATUS', =, 'binary:已付款')", FORMATTER => 'toString'}
```

#### 4.11.6 需求三：查询支付方式为1，且金额大于3000的订单

> 分析<br/>
此处需要使用多个过滤器共同来实现查询，多个过滤器，可以使用AND或者OR来组合多个过滤器完成查询<br/>
使用SingleColumnValueFilter实现对应列的查询

##### 4.11.6.1 命令

> 1.查询支付方式为1

```
SingleColumnValueFilter('C1', 'PAYWAY', = , 'binary:1')
```

> 2.查询金额大于3000的订单

```
SingleColumnValueFilter('C1', 'PAY_MONEY', > , 'binary:3000')
```

> 3.组合查询

```
scan 'ORDER_INFO', {FILTER => "SingleColumnValueFilter('C1', 'PAYWAY', = , 'binary:1') AND SingleColumnValueFilter('C1', 'PAY_MONEY', > , 'binary:3000')", FORMATTER => 'toString'}
```

> 注意：<br/>
HBase shell中比较默认都是字符串比较，所以如果是比较数值类型的，会出现不准确的情况<br/>
例如：在字符串比较中4000是比100000大的

### 4.12 INCR

#### 4.12.1 需求

> 某新闻APP应用为了统计每个新闻的每隔一段时间的访问次数，他们将这些数据保存在HBase中。<br/>
该表格数据如下所示：

新闻ID | 访问次数 | 时间段 | ROWKEY
---|---|---|---
0000000001 | 12 | 00:00-01:00 | 0000000001_00:00-01:00
0000000002 | 12 | 01:00-02:00 | 0000000002_01:00-02:00

> 要求：原子性增加新闻的访问次数值。

#### 4.12.2 incr操作简介

> incr可以实现对某个单元格的值进行原子性计数。语法如下：

```
incr '表名','rowkey','列蔟:列名',累加值（默认累加1）
```

> 如果某一列要实现计数功能，必须要使用incr来创建对应的列<br/>
使用put创建的列是不能实现累加的

#### 4.12.3 导入测试数据

![导入测试数据](/img/articleContent/大数据_HBase/11.png)

> 该脚本创建了一个表，名为NEWS_VISIT_CNT，列蔟为C1。并使用incr创建了若干个计数器，每个rowkey为：新闻的编号_时间段。CNT为count的缩写，表示访问的次数。

hbase shell /export/software/NEWS_VISIT_CNT.txt
scan 'NEWS_VISIT_CNT', {LIMIT => 5, FORMATTER => 'toString'}

#### 4.12.4 需求一：对0000000020新闻01:00 - 02:00访问计数+1

> 1.获取0000000020这条新闻在01:00-02:00当前的访问次数

```
get_counter 'NEWS_VISIT_CNT','0000000020_01:00-02:00','C1:CNT'
```

此处，如果用get获取到的数据是这样的：

```
base(main):029:0> get 'NEWS_VISIT_CNT','0000000020_01:00-02:00','C1:CNT'
COLUMN                                           CELL                                                                                                                                        
C1:CNT                                          timestamp=1599529533072, value=\x00\x00\x00\x00\x00\x00\x00\x06                                                                             
1 row(s)
Took 0.0243 seconds
```

> 2.使用incr进行累加

```
incr 'NEWS_VISIT_CNT','0000000020_01:00-02:00','C1:CNT'
```

> 3.再次查案新闻当前的访问次数

```
get_counter 'NEWS_VISIT_CNT','0000000020_01:00-02:00','C1:CNT'
```

### 4.13 更多的操作

> [以下连接可以查看到所有HBase中支持的SHELL脚本。](https://learnhbase.net/2013/03/02/hbase-shell-commands/)

```
https://learnhbase.net/2013/03/02/hbase-shell-commands/
```

## 5 shell管理操作

### 5.1 status

> 例如：显示服务器状态

```
2.4.1 :062 > status
1 active master, 0 backup masters, 3 servers, 0 dead, 1.0000 average load
Took 0.0034 seconds
```

### 5.2 whoami

> 显示HBase当前用户，例如：

```
2.4.1 :066 > whoami
root (auth:SIMPLE)
    groups: root
Took 0.0080 seconds
```
 
### 5.3 list

> 显示当前所有的表

```
2.4.1 :067 > list
TABLE                                                                                                                                                  
ORDER_INFO                                                                                                                                             
1 row(s)
Took 0.0266 seconds                                                                                                                                    
 => ["ORDER_INFO"]
 ```

### 5.4 count

> 统计指定表的记录数，例如：

```
2.4.1 :070 > count 'ORDER_INFO'
66 row(s)
Took 0.0404 seconds                                                                                                                                    
=> 66
```

### 5.5 describe

> 展示表结构信息

```
2.4.1 :074 > describe 'ORDER_INFO'
Table ORDER_INFO is ENABLED                                                                                                                            
ORDER_INFO                                                                                                                                             
COLUMN FAMILIES DESCRIPTION                                                                                                                            
{NAME => 'C1', VERSIONS => '1', EVICT_BLOCKS_ON_CLOSE => 'false', NEW_VERSION_BEHAVIOR => 'false', KEEP_DELETED_CELLS => 'FALSE', CACHE_DATA_ON_WRITE =
> 'false', DATA_BLOCK_ENCODING => 'NONE', TTL => 'FOREVER', MIN_VERSIONS => '0', REPLICATION_SCOPE => '0', BLOOMFILTER => 'ROW', CACHE_INDEX_ON_WRITE =
> 'false', IN_MEMORY => 'false', CACHE_BLOOMS_ON_WRITE => 'false', PREFETCH_BLOCKS_ON_OPEN => 'false', COMPRESSION => 'NONE', BLOCKCACHE => 'true', BLO
CKSIZE => '65536'}                                                                                                                                     
1 row(s)
Took 0.0265 seconds
```

### 5.6 exists

> 检查表是否存在，适用于表量特别多的情况

```
2.4.1 :075 > exists 'ORDER_INFO'
Table ORDER_INFO does exist                                                                                                                            
Took 0.0050 seconds                                                                                                                                    
=> true
```

### 5.7 is_enabled，is_disable

> 检查表是否启用或禁用

```
2.4.1 :077 > is_enabled 'ORDER_INFO'
true                                                                                                                                                   
Took 0.0058 seconds                                                                                                                                    
=> true
2.4.1 :078 > is_disabled 'ORDER_INFO'
false                                                                                                                                                  
Took 0.0085 seconds                                                                                                                                    
=> 1
```

### 5.8 alter

> 该命令可以改变表和列族的模式，例如：

```
# 创建一个USER_INFO表，两个列蔟C1、C2
create 'USER_INFO', 'C1', 'C2'
# 新增列蔟C3
alter 'USER_INFO', 'C3'
# 删除列蔟C3
alter 'USER_INFO', 'delete' => 'C3'
```

注意：

```
'delete' => 'C3'，还是一个Map结构，只不过只有一个key，可以省略两边的{}
```

### 5.9 disable/enable

> 禁用一张表/启用一张表

### 5.10 drop 

> 删除一张表，记得在删除表之前必须先禁用

### 5.11 truncate

> 清空表的数据，禁用表-删除表-创建表

## 6 HBase Java操作

### 6.1 需求与数据集

> 某某自来水公司，需要存储大量的缴费明细数据。以下截取了缴费明细的一部分内容。

用户id | 姓名 | 用户地址 | 性别 | 缴费时间 | 表示数（本次） | 表示数（上次） | 用量（立方） | 合计金额 | 查表日期 | 最迟缴费日期 
---|---|---|---|---|---|---|---|---|---|---
4944191 | 登卫红 | 贵州省铜仁市德江县7单元267室 | 男 | 2020-05-10 | 308.1 | 283.1 | 25 | 150 | 2020-04-25 | 2020-06-09 

> 因为缴费明细的数据记录非常庞大，该公司的信息部门决定使用HBase来存储这些数据。并且，他们希望能够通过Java程序来访问这些数据。

### 6.2 依赖

```xml
<repositories><!-- 代码库 -->
        <repository>
            <id>aliyun</id>
            <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>false</enabled>
                <updatePolicy>never</updatePolicy>
            </snapshots>
        </repository>
    </repositories>

    <dependencies>
        <dependency>
            <groupId>org.apache.hbase</groupId>
            <artifactId>hbase-client</artifactId>
            <version>2.1.0</version>
        </dependency>
        <dependency>
            <groupId>commons-io</groupId>
            <artifactId>commons-io</artifactId>
            <version>2.6</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>6.14.3</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.1</version>
                <configuration>
                    <target>1.8</target>
                    <source>1.8</source>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

### 6.3 需求代码

```
package cn.xiaoma.hbase.admin.api_test;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.*;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.filter.BinaryPrefixComparator;
import org.apache.hadoop.hbase.filter.SingleColumnValueFilter;
import org.apache.hadoop.hbase.util.Bytes;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import java.util.List;

/**
 @desc 此类用于java操作hbase相关测试类
 @date 2021-01-18 14:48:07
 @author xiaoma
 */
public class TableAmdinTest {
    //需求一: 创建一个名为WATER_BILL的表，包含一个列蔟C1。
    @Test
    @SuppressWarnings("all")
    public void test01() throws Exception{

        //1. 获取hbase的连接对象:
        Configuration conf = HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum","node1:2181,node2:2181,node3:2181");
        Connection connection = ConnectionFactory.createConnection(conf);

        //2. 获取执行操作的相关管理对象:  admin对象(对表的操作)  和  table对象 (对表数据的操作)

        Admin admin = connection.getAdmin();

        //3. 执行相关的操作: 创建表

        //3.1: 先判断要创建表是否存在
        boolean flag = admin.tableExists(TableName.valueOf("WATER_BILL")); // 如果存在 就为 true  如果不存在 为 false
        if(flag){
            return;
        }

        //3.2: 创建表
        TableDescriptorBuilder tableDescriptorBuilder = TableDescriptorBuilder.newBuilder(TableName.valueOf("WATER_BILL"));

        ColumnFamilyDescriptor familyDescriptor = ColumnFamilyDescriptorBuilder.newBuilder("C1".getBytes()).build();
        tableDescriptorBuilder.setColumnFamily(familyDescriptor);

        TableDescriptor tableDescriptor = tableDescriptorBuilder.build();
        admin.createTable(tableDescriptor);

        //4. 释放资源

        admin.close();
        connection.close();

    }
    private  String tableName = "WATER_BILL";
    //需求二: 插入一条数据:
    @Test
    public void test02() throws Exception {

        //1. 获取 hbase的客户端连接对象
        Configuration conf = HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum","node1:2181,node2:2181,node3:2181");
        Connection connection = ConnectionFactory.createConnection(conf);
        //2. 根据连接对象, 获取相关的管理对象: admin  table
        Table table = connection.getTable(TableName.valueOf(tableName));
        //3. 执行相关的操作: 添加数据   put命令

        Put put = new Put("4944191".getBytes());
        put.addColumn("C1".getBytes(),"NAME".getBytes(),"登卫红".getBytes());

        table.put(put); // 增 删 该 不需要返回值

        //4. 释放资源
        table.close();
        connection.close();

    }
    private  Connection connection;
    private  Admin admin ;
    private Table table;
    @BeforeTest
    public  void before() throws Exception{
        //1. 获取 hbase的客户端连接对象
        Configuration conf = HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum","node1:2181,node2:2181,node3:2181");
        connection = ConnectionFactory.createConnection(conf);

        //2. 根据连接对象, 获取相关的管理对象: admin  table
        admin = connection.getAdmin();
        table = connection.getTable(TableName.valueOf(tableName));
    }


    /*

        列名	说明	值
        ADDRESS	用户地址	贵州省铜仁市德江县7单元267室
        SEX	性别	男
        PAY_DATE	缴费时间	2020-05-10
        NUM_CURRENT	表示数（本次）	308.1
        NUM_PREVIOUS	表示数（上次）	283.1
        NUM_USAGE	用量（立方）	25
        TOTAL_MONEY	合计金额	150
        RECORD_DATE	查表日期	2020-04-25
        LATEST_DATE	最迟缴费日期	2020-06-09

     */
    // 需求3: 添加一行数据: 多列
    @Test
    public void test03() throws Exception{
        //1. 根据连接工厂, 创建连接对象: @Before

        //2. 根据连接对象, 创建相关的管理对象:  @Before

        //3. 执行相关的操作: 添加一行数据: 多列

        Put put = new Put("4944191".getBytes()); // 一个put表示封装一行数据
        put.addColumn("C1".getBytes(),"ADDRESS".getBytes(),"贵州省铜仁市德江县7单元267室".getBytes());
        put.addColumn("C1".getBytes(),"SEX".getBytes(),"男".getBytes());
        put.addColumn("C1".getBytes(),"PAY_DATE".getBytes(),"2020-05-10".getBytes());
        put.addColumn("C1".getBytes(),"NUM_CURRENT".getBytes(),"308.1".getBytes());
        put.addColumn("C1".getBytes(),"NUM_PREVIOUS".getBytes(),"283.1".getBytes());
        put.addColumn("C1".getBytes(),"NUM_USAGE".getBytes(),"25".getBytes());
        put.addColumn("C1".getBytes(),"TOTAL_MONEY".getBytes(),"150".getBytes());
        put.addColumn("C1".getBytes(),"RECORD_DATE".getBytes(),"2020-04-25".getBytes());
        put.addColumn("C1".getBytes(),"LATEST_DATE".getBytes(),"2020-06-09".getBytes());


        table.put(put);

        //4. 释放资源:  @After


    }

    // 需求4: 如何查询某一条数据:
    @Test
    public void test04() throws Exception{

        //1. 根据连接工厂, 创建连接对象: @Before

        //2. 根据连接对象, 创建相关的管理对象:  @Before

        //3. 执行相关的操作: 如何查询某一条数据: get
        Get get = new Get("4944191".getBytes());
        Result result = table.get(get);

        //4. 获取数据 : 一个 result对象 就是一行数据对象
        List<Cell> cellList = result.listCells();

        for (Cell cell : cellList) { // 每一个单元格: rowkey 列族 列名 列值
            // 对于单元格操作, 专门hbase提供了一个工具类 CellUtils
            byte[] rowkeyBytes = CellUtil.cloneRow(cell);
            String rowkey = Bytes.toString(rowkeyBytes);

            byte[] familyBytes = CellUtil.cloneFamily(cell);
            String family = Bytes.toString(familyBytes);

            byte[] qualifierBytes = CellUtil.cloneQualifier(cell);
            String qualifier = Bytes.toString(qualifierBytes);

            byte[] valueBytes = CellUtil.cloneValue(cell);
            String value = Bytes.toString(valueBytes);


            System.out.println("rowkey为:"+rowkey +";列族为:"+family+";列名为:"+qualifier+";列值为:"+value);
        }


        //5. 释放资源:  @After

    }

    //需求5: 如何删除一条数据
    @Test
    public void test05() throws Exception{

        //1. 根据连接工厂, 创建连接对象: @Before

        //2. 根据连接对象, 创建相关的管理对象:  @Before

        //3. 执行相关的操作: 如何删除一条数据 说明: delete 删除整个一行 删除某几列, 删除某几个列族数据
        Delete delete = new Delete("4944191".getBytes());
        //delete.addColumn("C1".getBytes(),"ADDRESS".getBytes());

        table.delete(delete);


        //4. 释放资源:  @After

    }

    // 需求6: 删除表的操作
    @Test
    public void test06() throws Exception{

        //1. 根据连接工厂, 创建连接对象: @Before

        //2. 根据连接对象, 创建相关的管理对象:  @Before


        //3. 执行相关的操作:删除表的操作
        //3.1: 禁用表
        admin.disableTable(TableName.valueOf(tableName));

        //3.2: 判断表是否已经禁用了呢
        boolean flag = admin.isTableDisabled(TableName.valueOf(tableName));
        if(flag){
            admin.deleteTable(TableName.valueOf(tableName));

        }

        //4. 释放资源:  @After

    }

    // 需求7: 查询2020年6月份所有用户的用水量
    @Test
    public void test07() throws Exception{

        //1. 根据连接工厂, 创建连接对象: @Before

        //2. 根据连接对象, 创建相关的管理对象:  @Before


        //3. 执行相关的操作:查询2020年6月份所有用户的用水量
        Scan scan = new Scan();  // 扫描全部数据

        SingleColumnValueFilter filter = new SingleColumnValueFilter(
                "C1".getBytes(), "RECORD_DATE".getBytes(), CompareOperator.EQUAL, new BinaryPrefixComparator("2020-06".getBytes()));
        scan.setFilter(filter);


        // 结果需要有: NAME NUM_USAGE
        scan.addColumn("C1".getBytes(),"LATEST_DATE".getBytes());

        ResultScanner results = table.getScanner(scan);

        //4. 获取数据:
        for (Result result : results) {

            List<Cell> cellList = result.listCells();

            for (Cell cell : cellList) {

                String rowkey = Bytes.toString(CellUtil.cloneRow(cell));
                String family = Bytes.toString(CellUtil.cloneFamily(cell));
                String qualifier = Bytes.toString(CellUtil.cloneQualifier(cell));

                //NUM_USAGE这一列用double类型展示，因为如果存的不是string，那么就会打印乱码
                if(qualifier.equals("NUM_USAGE")){
                    Double value = Bytes.toDouble(CellUtil.cloneValue(cell));
                    System.out.println("rowkey为:"+rowkey +";列族为:"+family+";列名为:"+qualifier+";列值为:"+value);
                }else{
                    String value = Bytes.toString(CellUtil.cloneValue(cell));
                    System.out.println("rowkey为:"+rowkey +";列族为:"+family+";列名为:"+qualifier+";列值为:"+value);
                }



            }

            System.out.println("---------------------------");
        }


        //5. 释放资源

    }

    @AfterTest
    public void close() throws Exception{
        table.close();
        admin.close();
        connection.close();
    }
}

```

## 7 HBase高可用

考虑关于HBase集群的一个问题，在当前的HBase集群中，只有一个Master，一旦Master出现故障，将会导致HBase不再可用。所以，在实际的生产环境中，是非常有必要搭建一个高可用的HBase集群的。

### 7.1 HBase高可用简介

HBase的高可用配置其实就是HMaster的高可用。要搭建HBase的高可用，只需要再选择一个节点作为HMaster，在HBase的conf目录下创建文件backup-masters，然后再backup-masters添加备份Master的记录。一条记录代表一个backup master，可以在文件配置多个记录。

### 7.2 HBase高可用搭建

> 1.在hbase的conf文件夹中创建backup-masters文件

```
cd/export/servers/hbase-2.1.0/conf
touch backup-masters
```

> 2.将node2.xiaoma.cn和node3.xiaoma.cn添加到该文件中

```
vim backup-masters
node2.xiaoma.cn
node3.xiaoma.cn
```

> 3.将backup-masters文件分发到所有的服务器节点中

```
scp backup-masters node2.xiaoma.cn:$PWD
scp backup-masters node3.xiaoma.cn:$PWD
```

> 4.重新启动hbase

```
stop-hbase.sh
start-hbase.sh
```

> 5.查看webui，检查BackupMasters中是否有node2.xiaoma.cn、node3.xiaoma.cn

```
http://node1.xiaoma.cn:16010/master-status
```

> 6.尝试杀掉node1.xiaoma.cn节点上的master

```
kill -9 HMaster进程id
```

> 7.访问http://node2.xiaoma.cn:16010和http://node3.xiaoma.cn:16010，观察是否选举了新的Master

> 8 再开启node1的HMaster

```
hbase-daemon.sh start master
```

## 8 HBase架构

### 8.1 系统架构

![HBase架构](/img/articleContent/大数据_HBase/12.png)

![HBase架构](/img/articleContent/大数据_HBase/13.png)

#### 8.1.1 Client

> 客户端，例如：发出HBase操作的请求。例如：之前我们编写的Java API代码、以及HBase shell，都是CLient

#### 8.1.2 Master Server

> 在HBase的Web UI中，可以查看到Master的位置。

- 监控RegionServer
- 处理RegionServer故障转移
- 处理元数据的变更
- 处理region的分配或移除
- 在空闲时间进行数据的负载均衡
- 通过Zookeeper发布自己的位置给客户端

#### 8.1.3 Region Server

> 处理分配给它的Region<br/>
负责存储HBase的实际数据<br/>
刷新缓存到HDFS<br/>
维护HLog<br/>
执行压缩<br/>
负责处理Region分片

> RegionServer中包含了大量丰富的组件，如下：

- Write-Ahead logs
- HFile(StoreFile)
- Store
- MemStore
- Region

### 8.2 逻辑结构模型

![逻辑结构模型](/img/articleContent/大数据_HBase/14.png)

#### 8.2.1 Region

> 在HBASE中，表被划分为很多「Region」，并由Region Server提供服务

![Region](/img/articleContent/大数据_HBase/15.png)

#### 8.2.2 Store

> Region按列族垂直划分为「Store」，存储在HDFS在文件中

#### 8.2.3 MemStore

> MemStore与缓存内存类似<br/>
当往HBase中写入数据时，首先是写入到MemStore<br/>
每个列族将有一个MemStore<br/>
当MemStore存储快满的时候，整个数据将写入到HDFS中的HFile中

#### 8.2.4 StoreFile

> 每当任何数据被写入HBASE时，首先要写入MemStore<br/>
当MemStore快满时，整个排序的key-value数据将被写入HDFS中的一个新的HFile中<br/>
写入HFile的操作是连续的，速度非常快<br/>
物理上存储的是HFile

#### 8.2.5 WAL

> WAL全称为Write Ahead Log，它最大的作用就是	故障恢复<br/>
WAL是HBase中提供的一种高并发、持久化的日志保存与回放机制<br/>
每个业务数据的写入操作（PUT/DELETE/INCR），都会保存在WAL中<br/>
一旦服务器崩溃，通过回放WAL，就可以实现恢复崩溃之前的数据<br/>
物理上存储是Hadoop的Sequence File

## 9 表结构设计

### 9.1 名称空间

#### 9.1.1 说明

- 在一个项目中，需要使用HBase保存多张表，这些表会按照业务域来划分
- 为了方便管理，不同的业务域以名称空间（namespace)来划分，这样管理起来会更加容易
- 类似于Hive中的数据库，不同的数据库下可以放不同类型的表
- HBase默认的名称空间是「default」，默认情况下，创建表时表都将创建在 default 名称空间下
- HBase中还有一个命名空间「hbase」，用于存放系统的内建表（namespace、meta）

#### 9.1.2 语法

##### 9.1.1 创建命名空间

```
create_namespace 'MOMO_CHAT'
```

##### 9.1.2 查看命名空间列表

```
list_namespace
```

##### 9.1.3 查看命名空间

```
describe_namespace 'MOMO_CHAT'
```

##### 9.1.4 命名空间创建表

> 在命令MOMO_CHAT命名空间下创建名为：MSG的表，该表包含一个名为C1的列蔟。<br/>
注意：带有命名空间的表，使用冒号将命名空间和表名连接到一起。

```
create 'MOMO_CHAT:MSG','C1'
```

##### 9.1.5 删除命名空间

> 删除命名空间，命名空间中必须没有表，如果命名空间中有表，是无法删除的

```
drop_namespace 'MOMO_CHAT'
```

### 9.2 列簇设计

> HBase列蔟的数量应该越少越好

- 两个及以上的列蔟HBase性能并不是很好
- 一个列蔟所存储的数据达到flush的阈值时，表中所有列蔟将同时进行flush操作
- 这将带来不必要的I/O开销，列蔟越多，对性能影响越大

`原则: 能少则少 原则上能用一个列族解决的, 坚决不使用两个  最多不超过5个`

### 9.3 版本设计

#### 9.3.1 说明

此处，我们需要保存的历史聊天记录是不会更新的，一旦数据保存到HBase中，就不会再更新
无需考虑版本问题
本次项目中只保留一个版本即可，这样可以节省大量空间
HBase默认创建表的版本为1，故此处保持默认即可

#### 9.3.2 查看表

> 通过以下输出可以看到：

- 版本是相对于列蔟而言
- 默认列蔟的版本数为1

```
hbase(main):015:0> describe "MOMO_CHAT:MSG"
Table MOMO_CHAT:MSG is ENABLED                                                                                                                                                                                                               
MOMO_CHAT:MSG                                                                                                                                                                                                                                
COLUMN FAMILIES DESCRIPTION                                                                                                                                                                                                                  
{NAME => 'C1', VERSIONS => '1', EVICT_BLOCKS_ON_CLOSE => 'false', NEW_VERSION_BEHAVIOR => 'false', KEEP_DELETED_CELLS => 'FALSE', CACHE_DATA_ON_WRITE => 'false', DATA_BLOCK_ENCODING => 'NONE', TTL => 'FOREVER', MIN_VERSIONS => '0', REPLI
CATION_SCOPE => '0', BLOOMFILTER => 'ROW', CACHE_INDEX_ON_WRITE => 'false', IN_MEMORY => 'false', CACHE_BLOOMS_ON_WRITE => 'false', PREFETCH_BLOCKS_ON_OPEN => 'false', COMPRESSION => 'NONE', BLOCKCACHE => 'true', BLOCKSIZE => '65536'}

1 row(s)
```

### 9.4 数据压缩

#### 9.4.1 压缩算法

> 在HBase可以使用多种压缩编码，包括LZO、SNAPPY、GZIP。只在硬盘压缩，内存中或者网络传输中没有压缩。

压缩算法 | 压缩后占比 | 压缩 | 解压缩
---|---|---|---
GZIP | 13.4% | 21 MB/s | 118 MB/s
LZO | 20.5% | 135 MB/s | 410 MB/s
Zippy/Snappy | 22.2% | 172 MB/s | 409 MB/s

- GZIP的压缩率最高，但是其实CPU密集型的，对CPU的消耗比其他算法要多，压缩和解压速度也慢；
- LZO的压缩率居中，比GZIP要低一些，但是压缩和解压速度明显要比GZIP快很多，其中解压速度快的更多；
- Zippy/Snappy的压缩率最低，而压缩和解压速度要稍微比LZO要快一些
- 本案例采用GZ算法，这样可以确保的压缩比最大化，更加节省空间

> 如何选择压缩算法:

- 如果数据只是写入, 不进行读取: 一般选择 gzip  或者  LZO  如果要求压缩比最高 选择 gzip
- 如果数据既要进行写入, 又要进行读取: 建议选择 snappy

#### 9.4.2 查看表数据压缩方式

> 通过以下输出可以看出，HBase创建表默认是没有指定压缩算法的

```
hbase(main):015:0> describe "MOMO_CHAT:MSG"
Table MOMO_CHAT:MSG is ENABLED                                                                                                                                                                                                               
MOMO_CHAT:MSG                                                                                                                                                                                                                                
COLUMN FAMILIES DESCRIPTION                                                                                                                                                                                                                  
{NAME => 'C1', VERSIONS => '1', EVICT_BLOCKS_ON_CLOSE => 'false', NEW_VERSION_BEHAVIOR => 'false', KEEP_DELETED_CELLS => 'FALSE', CACHE_DATA_ON_WRITE => 'false', DATA_BLOCK_ENCODING => 'NONE', TTL => 'FOREVER', MIN_VERSIONS => '0', REPLI
CATION_SCOPE => '0', BLOOMFILTER => 'ROW', CACHE_INDEX_ON_WRITE => 'false', IN_MEMORY => 'false', CACHE_BLOOMS_ON_WRITE => 'false', PREFETCH_BLOCKS_ON_OPEN => 'false', COMPRESSION => 'NONE', BLOCKCACHE => 'true', BLOCKSIZE => '65536'}

1 row(s)
```

#### 9.4.3 设置数据压缩

> 本案例中，我们使用GZ压缩算法，语法如下：

> 创建新的表，并指定数据压缩算法

```
create "MOMO_CHAT:MSG", {NAME => "C1", COMPRESSION => "GZ"}
```

> 修改已有的表，并指定数据压缩算法

```
alter "MOMO_CHAT:MSG", {NAME => "C1", COMPRESSION => "GZ"}
```

### 9.5 ROWKEY设计原则

#### 9.5.1 HBase官方的设计原则

##### 9.5.1.1 避免使用递增行键/时序数据

> 如果ROWKEY设计的都是按照顺序递增（例如：时间戳），这样会有很多的数据写入时，负载都在一台机器上。我们尽量应当将写入大压力均衡到各个RegionServer

##### 9.5.1.2 避免ROWKEY和列的长度过大

> 在HBase中，要访问一个Cell（单元格），需要有ROWKEY、列蔟、列名，如果ROWKEY、列名太大，就会占用较大内存空间。所以ROWKEY和列的长度应该尽量短小

> ROWKEY的最大长度是64KB，建议越短越好，不宜过长，一般为100字节以内，大部分业务定义0-20字节之间

> 列的长度也是不宜过长，一般0-10

##### 9.5.1.3 使用long等类型比String类型更省空间

> long类型为8个字节，8个字节可以保存非常大的无符号整数，例如：18446744073709551615。如果是字符串，是按照一个字节一个字符方式保存，需要快3倍的字节数存储。

##### 9.5.1.4 ROWKEY唯一性

> 设计ROWKEY时，必须保证RowKey的唯一性

> 由于在HBase中数据存储是Key-Value形式，若向HBase中同一张表插入相同RowKey的数据，则原先存在的数据会被新的数据覆盖。

#### 9.5.2 避免数据热点

> 热点是指大量的客户端（client）直接访问集群的一个或者几个节点（可能是读、也可能是写）

> 大量地访问量可能会使得某个服务器节点超出承受能力，导致整个RegionServer的性能下降，其他的Region也会受影响

##### 9.5.2.1 预分区

> 默认情况，一个HBase的表只有一个Region，被托管在一个RegionServer中

![预分区](/img/articleContent/大数据_HBase/16.png)

> 每个Region有两个重要的属性：Start Key、End Key，表示这个Region维护的ROWKEY范围

> 如果只有一个Region，那么Start Key、End Key都是空的，没有边界。所有的数据都会放在这个Region中，但当数据越来越大时，会将Region分裂，取一个Mid Key来分裂成两个Region

> 预分区个数 = 节点的倍数。默认Region的大小为10G，假设我们预估1年下来的大小为10T，则10000G / 10G = 1000个Region，所以，我们可以预设为1000个Region，这样，1000个Region将均衡地分布在各个节点上

##### 9.5.2.2 ROWKEY避免热点设计

> 1.反转策略

- 如果设计出的ROWKEY在数据分布上不均匀，但ROWKEY尾部的数据却呈现出了良好的随机性，可以考虑`将ROWKEY的翻转`，或者直接将尾部的bytes提前到ROWKEY的开头。
- 反转策略可以使ROWKEY随机分布，但是牺牲了ROWKEY的有序性
- 缺点：利于Get操作，但不利于Scan操作，因为数据在原ROWKEY上的自然顺序已经被打乱

> 2.加盐策略

- Salting（加盐）的原理是在原ROWKEY的`前面`添加固定长度的随机数，也就是给ROWKEY分配一个随机前缀使它和之间的ROWKEY的开头不同
- 随机数能保障数据在所有Regions间的负载均衡
- 缺点：因为添加的是随机数，基于原ROWKEY查询时无法知道随机数是什么，那样在查询的时候就需要去各个可能的Regions中查找，加盐对比读取是无力的

> 3.哈希策略

- 基于 ROWKEY的完整或部分数据进行 Hash，而后将Hashing后的值完整替换或部分替换原ROWKEY的前缀部分
- 这里说的 hash 包含 MD5、sha1、sha256 或 sha512 等算法
- 缺点：Hashing 也不利于 Scan，因为打乱了原RowKey的自然顺序

#### 9.5.3 陌陌打招呼数据预分区

##### 9.5.3.1 预分区

> 在HBase中，可以通过指定start key、end key来进行分区，还可以直接指定Region的数量，指定分区的策略。

> 1.指定 start key、end key来分区

```
hbase> create 'ns1:t1', 'f1', SPLITS => ['10', '20', '30', '40']
hbase> create 't1', 'f1', SPLITS => ['10', '20', '30', '40']
hbase> create 't1', 'f1', SPLITS_FILE => 'splits.txt', OWNER => 'johndoe'
```

> 2.指定分区数量、分区策略

```
hbase> create 't1', 'f1', {NUMREGIONS => 15, SPLITALGO => 'HexStringSplit'}
```

> 分区策略

- HexStringSplit: ROWKEY是十六进制的字符串作为前缀的
- DecimalStringSplit: ROWKEY是10进制数字字符串作为前缀的
- UniformSplit: ROWKEY前缀完全随机

> Region的数量可以按照数据量来预估。本次案例，因为受限于虚拟机，所以我们设计为6个Region。因为ROWKEY我们是使用多个字段拼接，而且前缀不是完全随机的，所以需要使用HexStringSplit。

##### 9.5.3.2 ROWKEY设计

- 为了确保数据均匀分布在每个Region，需要以MD5Hash作为前缀
- `ROWKEY = MD5Hash_发件人账号_收件人账号_时间戳`

![ROWKEY设计](/img/articleContent/大数据_HBase/17.png)

##### 9.5.3.3 业务分区脚本

```
create 'MOMO_CHAT:MSG', {NAME => "C1", COMPRESSION => "GZ"}, { NUMREGIONS => 6, SPLITALGO => 'HexStringSplit'}
```

> 执行完命令后，我们发现该表已经分为6个分区。这样将来数据就可以均匀地分布到不同的分区中了

`注意：勾选ShowDetailName&Start/EndKey，点击Recorder`

![业务分区脚本](/img/articleContent/大数据_HBase/18.png)

HDFS中，也有对应的6个文件夹。
URL：/hbase/data/MOMO_CHAT/MSG

![HDFS查看](/img/articleContent/大数据_HBase/19.png)

## 10 性能问题

> Hbase默认只支持对行键的索引，那么如果要针对其它的列来进行查询，就只能全表扫描

> 上述的查询是使用scan + filter组合来进行查询的，但查询地效率不高，因为要进行顺序全表扫描而没有其他索引。如果数据量较大，只能在客户端（client）来进行处理，如果要传输到Client大量的数据，然后交由客户端处理

- `网络传输压力很大`
- `客户端的压力很大`

> 如果表存储的数据量很大时，效率会非常低下，此时需要使用二级索引

> 也就是除了ROWKEY的索引外，还需要人为添加其他的方便查询的索引

> 如果每次需要我们开发二级索引来查询数据，这样使用起来很麻烦。再者，查询数据都是HBase Java API，使用起来不是很方便。为了让其他开发人员更容易使用该接口。如果有一种SQL引擎，通过SQL语句来查询数据会更加方便。

此时，使用Apache Phoenix就可以解决我们上述问题，{% post_link 大数据_Phoenix 点击前往查看Phoenix相关知识 %}。

![Phoenix](/img/articleContent/大数据_HBase/20.png)

## 联系博主，加入【羊山丨交流社区】
![联系博主](/img/icon/wechatFindMe.png)

![image](/img/articleContent/大数据_HBase/1.png)