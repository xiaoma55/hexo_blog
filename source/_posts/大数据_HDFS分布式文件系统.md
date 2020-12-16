---
title: HDFS分布式文件系统
index_img: /img/articleBg/1(35).jpg
banner_img: /img/articleBg/1(35).jpg
tags:
  - Cenos7
  - 大数据
  - Hadoop
  - HDFS
category:
  - - 编程
    - 大数据
comment: 'off'
date: 2020-12-16 15:40:36
---

HDFS（Hadoop Distributed File System）是 Apache Hadoop 项目的一个子项目。

 Hadoop 非常适于存储大型数据 (比如 TB 和 PB), 其就是使用 HDFS 作为存储系统.。
 
 HDFS 使用多台计算机存储文件, 并且提供统一的访问接口, 像是访问一个普通文件系统一样使用分布式文件系统. 

<!-- more -->

## 1 架构

> HDFS的四个基本组件:**HDFS Client**、**NameNode**、**DataNode** 和 **Secondary NameNode**。

![Hadoop目录](/img/articleContent/HDFS分布式文件系统/1.png)

> 1、Client：就是客户端。

```
文件切分。文件上传 HDFS 的时候，Client 将文件切分成 一个一个的Block，然后进行存储

与 NameNode 交互，获取文件的位置信息。

与 DataNode 交互，读取或者写入数据。

Client 提供一些命令来管理 和访问HDFS，比如启动或者关闭HDFS。
```

> 2、NameNode：就是 master，它是一个主管、管理者。

```
管理 HDFS 的名称空间

管理数据块（Block）映射信息

配置副本策略

处理客户端读写请求。
```
> 3、DataNode：就是Slave。NameNode 下达命令，DataNode 执行实际的操作。

```
存储实际的数据块。

执行数据块的读/写操作。
```
> 4、Secondary NameNode：并非 NameNode 的热备。当NameNode 挂掉的时候，它并不能马上替换 NameNode 并提供服务。

```
辅助 NameNode，分担其工作量。

定期合并 fsimage和fsedits，并推送给NameNode。

在紧急情况下，可辅助恢复 NameNode。
```

![Hadoop目录](/img/articleContent/HDFS分布式文件系统/2.png)

## 2 副本机制

### 2.1 文件副本机制

> HDFS被设计成能够在一个大集群中跨机器可靠地存储超大文件。**它将每个文件存储成一系列的数据块，这个数据块被称为block**，除了最后一个，所有的数据块都是同样大小的。

> 为了容错，文件的所有block都会有副本。每个文件的数据块大小和副本系数都是可配置的。

> 所有的文件都是以 block 块的方式存放在 HDFS 文件系统当中,作用如下

1. 一个文件有可能大于集群中任意一个磁盘，引入块机制,可以很好的解决这个问题
2. 使用块作为文件存储的逻辑单位可以简化存储子系统
3. 块非常适合用于数据备份进而提供数据容错能力
4. 副本优点是安全，缺点是占空间

> 在 Hadoop1 当中, 文件的 block 块默认大小是 64M, hadoop2 当中, 文件的 block 块大小默认是 128M（134217728字节）。假设文件大小是100GB，从字节位置0开始，每128MB字节划分为一个block，依此类推，可以划分出很多的block。每个block就是128MB大小。

> block块的大小可以通过 hdfs-site.xml 当中的配置文件进行指定，Hadoop默认的副本数为3,也就是每个block会存三份。


```
<property>
   <name>dfs.block.size</name>
   <value>块大小以字节为单位</value>
</property>\
```

![Hadoop目录](/img/articleContent/HDFS分布式文件系统/3.png)

![Hadoop目录](/img/articleContent/HDFS分布式文件系统/4.png)

**注意当一个文件的大小不足128M时，比如文件大小为2M，那么这个文件也占用一个block，但是这个block实际只占2M的空间，所以从某种意义上来讲，block只是一个逻辑单位。**

### 2.2 副本放置策略（机架感知）

> HDFS分布式文件系统的内部有一个副本存放策略，默认副本数为3,在这里以副本数=3为例：

> 第一副本：优先放置到离写入客户端最近的DataNode节点，如果上传节点就是DataNode，则直接上传到该节点，如果是集群外提交，则随机挑选一台磁盘不太慢，CPU不太忙的节点。

> 第二个副本：放置在与第一个同机架的不同机器中

> 第三个副本：放置在另一个机架中, 某一个服务器中

![Hadoop目录](/img/articleContent/HDFS分布式文件系统/5.png)

## 3 Shell命令行使用

[官网手册](https://hadoop.apache.org/docs/r2.7.5/hadoop-project-dist/hadoop-common/FileSystemShell.html#appendToFile)

## 4 高级使用命令

### 4.1 HDFS的安全模式

安全模式是hadoop的一种保护机制，用于保证集群中的数据块的安全性。当集群启动的时候，会首先进入安全模式。当系统处于安全模式时会检查数据块的完整性。

假设我们设置的副本数（即参数dfs.replication）是3，那么在datanode上就应该有3个副本存在，假设只存在2个副本，那么比例就是2/3=0.666。hdfs默认的副本率0.999。我们的副本率0.666明显小于0.999，因此系统会自动的复制副本到其他dataNode，使得副本率不小于0.999。如果系统中有5个副本，超过我们设定的3个副本，那么系统也会删除多于的2个副本。

> **在安全模式状态下，文件系统只接受读数据请求，而不接受删除、修改等变更请求**。<br/>在当整个系统达到安全标准时，HDFS自动离开安全模式。

![Hadoop目录](/img/articleContent/HDFS分布式文件系统/6.png)

> 安全模式操作命令

```
hdfs  dfsadmin -safemode get #查看安全模式状态
hdfs  dfsadmin -safemode  enter #进入安全模式
hdfs  dfsadmin -safemode  leave #离开安全模式
```

### 4.2 HDFS基准测试

> 实际生产环境当中，hadoop的环境搭建完成之后，第一件事情就是进行压力测试，测试我们的集群的读取和写入速度，测试我们的网络带宽是否足够等一些基准测试

#### 8.2.1 测试写入速度

> 向HDFS文件系统中写入数据,10个文件,每个文件10MB,文件存放到/benchmarks/TestDFSIO中

```
hadoop jar /export/servers/hadoop-2.7.5/share/hadoop/mapreduce/hadoop-mapreduce-client-jobclient-2.7.5.jar TestDFSIO -write -nrFiles 10 -fileSize 10MB
```

> 完成之后查看写入速度结果

```
hadoop fs -text /benchmarks/TestDFSIO/io_write/part-00000
```

#### 4.2.2 测试读取速度

> 测试hdfs的读取文件性能
<br/>在HDFS文件系统中读入10个文件,每个文件10M

```
hadoop jar /export/servers/hadoop-2.7.5/share/hadoop/mapreduce/hadoop-mapreduce-client-jobclient-2.7.5.jar  TestDFSIO -read -nrFiles 10 -fileSize 10MB
```

> 查看读取果

```
hadoop fs -text /benchmarks/TestDFSIO/io_read/part-00000
```

#### 4.2.3 清除测试数据

```
 hadoop jar /export/servers/hadoop-2.7.5/share/hadoop/mapreduce/hadoop-mapreduce-client-jobclient-2.7.5.jar TestDFSIO -clean
```

## 5 基本原理

### 5.1 NameNode

![Hadoop目录](/img/articleContent/HDFS分布式文件系统/7.png)

#### 5.1.1 概念

NameNode在内存中保存着整个文件系统的名称空间和文件数据块的地址映射

整个HDFS可存储的文件数受限于NameNode的内存大小

> 1 NameNode元数据信息 

文件名，文件目录结构，文件属性(生成时间，副本数，权限)每个文件的块列表。 以及列表中的块与块所在的DataNode之间的地址映射关系 在内存中加载文件系统中每个文件和每个数据块的引用关系(文件、block、datanode之间的映射信息) 数据会定期保存到本地磁盘（fsImage文件和edits文件）

> 2 NameNode文件操作

NameNode负责文件元数据的操作 DataNode负责处理文件内容的读写请求，数据流不经过NameNode，会询问它跟那个DataNode联系
> 3 DataNode副本

文件数据块到底存放到哪些DataNode上，是由NameNode决定的，NameNode根据全局情况做出放置副本的决定 

> 4 NameNode心跳机制

全权管理数据块的复制，周期性的接受心跳和块的状态报告信息（包含该DataNode上所有数据块的列表） 若接受到心跳信息，NameNode认为DataNode工作正常，如果在10分钟后还接受到不到DataNode的心跳，那么NameNode认为DataNode已经宕机 ,这时候NN准备要把DN上的数据块进行重新的复制。 块的状态报告包含了一个DataNode上所有数据块的列表，blocks report 每个6小时发送一次.（默认6小时，去官网看就好了）

![Hadoop目录](/img/articleContent/HDFS分布式文件系统/8.png)

#### 5.1.2 作用

> 1 NameNode是HDFS的核心。

> 2 NameNode也称为Master。

> 3 NameNode仅存储HDFS的元数据：文件系统中所有文件的目录树，并跟踪整个集群中的文件。

> 4 NameNode不存储实际数据或数据集。数据本身实际存储在DataNodes中。

> 5 NameNode知道HDFS中任何给定文件的块列表及其位置。使用此信息NameNode知道如何从块中构建文件。

> 6 NameNode并不持久化存储每个文件中各个块所在的DataNode的位置信息，这些信息会在系统启动时从数据节点重建。

> 7 NameNode对于HDFS至关重要，当NameNode关闭时，HDFS / Hadoop集群无法访问。

> 8 NameNode是Hadoop集群中的单点故障。

> 9 NameNode所在机器通常会配置有大量内存（RAM）。

### 5.2 DataNode

> 1 Data Node以数据块的形式存储HDFS文件

> 2 DataNode也称为Slave。

> 3 NameNode和DataNode会保持不断通信。

> 4 DataNode启动时，它将自己发布到NameNode并汇报自己负责持有的块列表。

> 5 datanode 每隔6个小时, 会向namenode报告一次完整的块信息

> 6 当某个DataNode关闭时，它不会影响数据或群集的可用性。NameNode将安排由其他DataNode管理的块进行副本复制。

> 7 DataNode所在机器通常配置有大量的硬盘空间。因为实际数据存储在DataNode中。

> 8 DataNode会定期（dfs.heartbeat.interval配置项配置，默认是3秒）向NameNode发送心跳，如果NameNode长时间没有接受到DataNode发送的心跳， NameNode就会认为该DataNode失效。

`timeout = 2 * heartbeat.recheck.interval + 10 * dfs.heartbeat.interval`<br/>

而默认的heartbeat.recheck.interval大小为5分钟(单位毫秒)，<br/>dfs.heartbeat.interval默认大小为3秒.

**所以namenode如果在10分钟+30秒后，仍然没有收到datanode的心跳，就认为datanode已经宕机，并标记为dead。**

> 9 datanode block汇报时间间隔取参数dfs.blockreport.intervalMsec,参数未配置的话默认为6小时.

## 6 HDFS的读写工作机制

### 6.1 HDFS写数据流程

![Hadoop目录](/img/articleContent/HDFS分布式文件系统/9.png)

### 6.2 HDFS读数据流程

![Hadoop目录](/img/articleContent/HDFS分布式文件系统/10.png)

## 7 元数据辅助管理

当 Hadoop 的集群当中, NameNode的所有元数据信息都保存在了 FsImage 与 Eidts 文件当中, 这两个文件就记录了所有的数据的元数据信息, 元数据信息的保存目录配置在了 **hdfs-site.xml** 当中

```
<property>
   <name>dfs.namenode.name.dir</name>    
   <value>
       file:///export/serverss/hadoop2.7.5/hadoopDatas/namenodeDatas</value>
</property>
<property>
    <name>dfs.namenode.edits.dir</name>
    <value>file:///export/serverss/hadoop-2.7.5/hadoopDatas/nn/edits</value>
</property>>
```

### 7.1 FsImage和Edits

> edits

```
edits 是在NameNode启动时对整个文件系统的快照存放了客户端最近一段时间的操作日志

客户端对 HDFS 进行写文件时会首先被记录在 edits 文件中

edits 修改时元数据也会更新
```

> FsImage

```
fsimage是在NameNode启动时对整个文件系统的快照

NameNode 中关于元数据的镜像, 一般称为检查点, fsimage 存放了一份比较完整的元数据信息

因为 fsimage 是 NameNode 的完整的镜像, 如果每次都加载到内存生成树状拓扑结构，这是非常耗内存和CPU, 所以一般开始时对 NameNode 的操作都放在 edits 中

fsimage 内容包含了 NameNode 管理下的所有 DataNode 文件及文件 block 及 block 所在的 DataNode 的元数据信息.

随着edits 内容增大, 就需要在一定时间点和 fsimage 合并
```

### 7.2 SecondaryNameNode的作用

```
SecondaryNameNode的作用是合并fsimage和edits文件。
NameNode的存储目录树的信息，而目录树的信息则存放在fsimage文件中，当NameNode启动的时候会首先读取整个fsimage文件，将信息装载到内存中。
Edits文件存储日志信息，在NameNode上所有对目录的操作，增加，删除，修改等都会保存到edits文件中，并不会同步到fsimage中，当NameNode关闭的时候，也不会将fsimage和edits进行合并。
所以当NameNode启动的时候，首先装载fsimage文件，然后按照edits中的记录执行一遍所有记录的操作，最后把信息的目录树写入fsimage中，并删掉edits文件，重新启用新的edits文件。
```

### 7.3 SecondaryNameNode出现的原因

```
但是如果NameNode执行了很多操作的话，就会导致edits文件会很大，那么在下一次启动的过程中，就会导致NameNode的启动速度很慢，慢到几个小时也不是不可能，所以出现了SecondNameNode。
```

### 7.4 SecondaryNameNode唤醒合并的规则

```
SecondaryNameNode 会按照一定的规则被唤醒，进行fsimage和edits的合并，防止文件过大。
合并的过程是，将NameNode的fsimage和edits下载到SecondryNameNode 所在的节点的数据目录，然后合并到fsimage文件，最后上传到NameNode节点。合并的过程中不影响NameNode节点的操作
SecondaryNameNode被唤醒的条件可以在hdfs-site.xml中配置：

dfs.namenode.checkpoint.period：单位秒，默认值3600，检查点的间隔时间，当距离上次检查点执行超过该时间后启动检查点，就是edits和fsimage的合并
dfs.namenode.checkpoint.txns：事务操作次数，默认值1000000，当edits文件事务操作超过这个次数，就进行edits和fsimage的合并
dfs.namenode.checkpoint.check.period：单位秒，默认值60。1分钟检查一次操作次数

```

**[core-site.xml]**

```
<!-- 多久进行edits和fsimage的合并 -->
<property>
	<name>dfs.namenode.checkpoint.period</name>
	<value>3600</value>
</property>
<!-- 多少次事务操作之后进行edits和fsimage的合并 -->
<property>
	<name>dfs.namenode.checkpoint.txns</name>
	<value>1000000</value>
</property>
<!-- 1分钟检查一次操作次数 -->
<property>
	<name>dfs.namenode.checkpoint.check.period</name>
	<value>60</value>
</property>
```

SecondaryNameNode一般处于休眠状态，当两个检查点满足一个，即唤醒SecondaryNameNode执行合并过程。

### 7.5 SecondaryNameNode工作过程

```
第一步：将hdfs更新记录写入一个新的文件——edits.new。
第二步：将fsimage和editlog通过http协议发送至secondary namenode。
第三步：将fsimage与editlog合并，生成一个新的文件——fsimage.ckpt。这步之所以要在secondary namenode中进行，是因为比较耗时，如果在namenode中进行，或导致整个系统卡顿。
第四步：将生成的fsimage.ckpt通过http协议发送至namenode。
第五步：重命名fsimage.ckpt为fsimage，edits.new为edits。
第六步：等待下一次checkpoint触发SecondaryNameNode进行工作，一直这样循环操作。
```

![Hadoop目录](/img/articleContent/HDFS分布式文件系统/11.png)

注意:SecondaryNameNode 在合并 edits 和 fsimage 时需要消耗的内存和 NameNode 差不多, 所以一般

> SNN服务器内存一般要>=NameNode内存<br/>
SNN和NameNode放在不同的机器上

### 7.6 FsImage中的文件信息查看

使用命令

```
hdfs oiv
```

```
cd /export/server/hadoop-2.7.5/hadoopDatas/namenodeDatas/
ll
cd current/
cp fsimage_0000000000000000150 /export/data/
cd /export/data && ll
hdfs oiv -i fsimage_0000000000000000150 -p XML -o hello.xml
```

### 7.7 edits中的文件信息查看

使用命令

```
hdfs oev
```

```
cd /export/server/hadoop-2.7.5/hadoopDatas/nn/edits
cd /current && ll
cp edits_0000000000000000016-0000000000000000148 /export/data/
cd /export/data/
hdfs oev -i   edits_0000000000000000016-0000000000000000148 -p XML -o myedit.xml
```

### 7.8 NameNode元数据恢复

当NameNode发生故障时,我们可以通过将SecondaryNameNode中数据拷贝到NameNode存储数据的目录的方式来恢复NameNode的数据
操作步骤:

> 1 杀死NameNode进程

```
kill -9 NameNode进程号
```

> 2 删除NameNode存储的数据

```
rm -rf /export/server/hadoop-2.7.5/hadoopDatas/namenodeDatas/*
rm -rf /export/server/hadoop-2.7.5/hadoopDatas/nn/edits/*
```

> 3 拷贝SecondaryNameNode中数据到原NameNode存储数据目录

```
cd /export/server/hadoop-2.7.5/hadoopDatas/namenodeDatas/
scp -r node2:/export/server/hadoop-2.7.5/hadoopDatas/snn/name/* ./
```

```
cd /export/server/hadoop-2.7.5/hadoopDatas/nn/edits
scp -r node2:/export/server/hadoop-2.7.5/hadoopDatas/dfs/snn/edits/* ./
```

> 4 重新启动NameNode

```
hadoop-daemon.sh start namenode
```

## 8 API操作

## 9 其他功能

## 10 HDFS的高可用机制

## 11 Hadoop的联邦机制(Federation)


## 联系博主，加入【羊山丨交流社区】
![联系博主](/img/icon/wechatFindMe.png)