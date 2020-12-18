---
title: 大数据_MapReduce
index_img: /img/articleBg/1(39).jpg
banner_img: /img/articleBg/1(39).jpg
tags:
  - Cenos7
  - 大数据
  - Hadoop
  - MapReduce
  - - 编程
    - 大数据
comment: 'off'
date: 2020-12-18 18:57:13
---

写摘要，就是首页显示的那个

<!-- more -->

## 1 MapReduce基本概念

> 分布式计算框架，是hadoop的一部分。**分而治之**，比如`人口普查`

## 1.1 名词解释

### 1.1.1 Map

> **Map负责“分”**，即把复杂的任务分解为若干个“简单的任务”来并行处理。可以进行拆分的前提是这些小任务可以并行计算，彼此间几乎没有依赖关系。

<details>
<summary>这个具有强依赖关系，就不行</summary>

```
- 第一个人拿走：前300个同学的成绩 进行求平均分 ，等到平均分(70+80+90...+92.5)/300 = 80.5
- 第二个人拿走：300-2000个同学成绩，等到(70+85+90...+95)/1701= 69
- 第三个人拿走：2000-5000个同学成绩，等到(73+81+94...+92)/3000= 74.5
- 最终合并局部结果： (80.5+69+74.5)/3 是真正的平均值吗 ？ 肯定不是...
```

</details>

### 1.1.1 Reduce

> **Reduce负责“合”**，即对map阶段的结果进行全局汇总。

## 1.2 设计构思

### 1.2.1 如何对付大数据处理

> 对相互间不具有计算依赖关系的大数据，实现并行最自然的办法就是采取分而治之的策略。并行计算的第一个重要问题是如何划分计算任务或者计算数据以便对划分的子任务或数据块同时进行计算。不可分拆的计算任务或相互间有依赖关系的数据无法进行并行计算！

### 1.2.2 构建抽象模型

> MapReduce借鉴了函数式语言中的思想，用Map和Reduce两个函数提供了高层的并行编程抽象模型。<br/>

> Map: 对一组数据元素进行某种重复式的处理；<br/>

> Reduce: 对Map的中间结果进行某种进一步的结果整理。<br/>

> MapReduce中定义了如下的Map和Reduce两个抽象的编程接口，由用户去编程实现:<br/>

> map: (k1; v1) → [(k2; v2)]<br/>

> reduce: (k2; [v2]) → [(k3; v3)]<br/>

> Map和Reduce为程序员提供了一个清晰的操作接口抽象描述。通过以上两个编程接口，大家可以看出MapReduce处理的数据类型是<key,value>键值对。

### 1.2.3 统一构架，隐藏系统层细节

> 如何提供统一的计算框架，如果没有统一封装底层细节，那么程序员则需要考虑诸如数据存储、划分、分发、结果收集、错误恢复等诸多细节；为此，MapReduce设计并提供了统一的计算框架，为程序员隐藏了绝大多数系统层面的处理细节。

> MapReduce最大的亮点在于通过抽象模型和计算框架把需要做什么(what need to do)与具体怎么做(how to do)分开了，为程序员提供一个抽象和高层的编程接口和框架。程序员仅需要关心其应用层的具体计算问题，仅需编写少量的处理应用本身计算问题的程序代码。如何具体完成这个并行计算任务所相关的诸多系统层细节被隐藏起来,交给计算框架去处理：从分布代码的执行，到大到数千小到单个节点集群的自动调度使用。

## 1.3 核心功能

> 将用户编写的业务逻辑代码和MapReduce本身自带的组件整合到一个完整的分布式计算程序。

![MR构思](/img/articleContent/大数据_MapReduce/1.png)

> block 数据分块，是hdfs中的概念，物理上进行数据的分割，（默认128M）分成一个数据块，split是mapreduce中的一个逻辑的概念，mapTask处理数据的一个分片，具体怎么分片，是和 InputFormat。每个分片对应的是一个map任务。

## 2 MapReduce编程规范

> **数据传输的过程中，都是以 key - value的键值对出现的。**

### 2.1 三个阶段

### 2.1.1 map阶段

1. 读取数据，将数据转换成 k1 和 v1
2. 自定义 map逻辑， 将 k1 和 v1 转换成 k2 和 v2

![map阶段](/img/articleContent/大数据_MapReduce/2.png)

### 2.1.2 shuffle阶段

1. 分区： 将相同的k2的数据发送给同一个reduce程序
2. 排序：根据k2的数据，进行排序操作（按照字典顺序）
3. 规约combine：是局部聚合，是MapReduce的优化步骤
4. 分组：将相同的k2的值进行合并成为一个集合

![shuffle阶段](/img/articleContent/大数据_MapReduce/3.png)

### 2.1.3 reduce阶段

1. 自定义 reduce 任务的逻辑，将 shuffle 的 k2 和v2 进行转换操作得到 k3 和 v3
2. 输出操作：将k3 和v3 输出到指定的文件目录

![reduce阶段](/img/articleContent/大数据_MapReduce/4.png)

### 2.2 编程步骤

> 用户编写的程序分成三个部分：Mapper，Reducer，Driver(提交运行mr程序的客户端)

### 2.2.1 Mapper

(1)自定义类继承Mapper类<br/>
(2)重写自定义类中的map方法，在该方法中将K1和V1转为K2和V2<br/>
(3)将生成的K2和V2写入上下文中

### 2.2.2 Reducer

(1)自定义类继承Reducer类<br/>
(2)重写Reducer中的reduce方法，在该方法中将K2和[V2]转为K3和V3<br/>
(3)将K3和V3写入上下文中

### 2.2.3 Driver

> 整个程序需要一个Drvier来进行提交，提交的是一个描述了各种必要信息的job对象<br/>

（1）定义类，编写main方法<br/>
（2）在main方法中指定以下内容:<br/>
1、创建建一个job任务对象<br/>
2、指定job所在的jar包<br/>
3、指定源文件的读取方式类和源文件的读取路径<br/>
4、指定自定义的Mapper类和K2、V2类型<br/>
5、指定自定义分区类（如果有的话）<br/>
6、指定自定义分组类（如果有的话）<br/>
7、指定自定义的Reducer类和K3、V3的数据类型<br/>
8、指定输出方式类和结果输出路径<br/>
9、将job提交到yarn集群

### 2.3 编程示例(单词统计)

### 2.3.1 实现思路

![单词统计实现思路](/img/articleContent/大数据_MapReduce/5.png)

![单词统计实现思路](/img/articleContent/大数据_MapReduce/6.png)

### 2.3.2 数据准备

> 1 创建新文件

```
cd /export/server
vim wordcount.txt
```

> 2 向其中放入以下内容并保存

```
hello hello
world world
hadoop hadoop
hello world
hello flume
hadoop hive
hive kafka
flume storm
hive oozie
```

> 3 上传到 HDFS

```
hdfs dfs -mkdir -p /input/wordcount
hdfs dfs -put wordcount.txt /input/wordcount
```

> 4 查看上传结果

```
hdfs dfs -ls -R /input
```

#### 2.3.3 代码实现

<br/>
1.pom文件

<details>
<summary>点击查看pom</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>beijing45-parent</artifactId>
        <groupId>cn.itcast</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>day09_mapreduce1</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-common</artifactId>
            <version>2.7.5</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-client</artifactId>
            <version>2.7.5</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-hdfs</artifactId>
            <version>2.7.5</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-mapreduce-client-core</artifactId>
            <version>2.7.6</version>
        </dependency>
        <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13</version>
    </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.0</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                    <!--    <verbal>true</verbal>-->
                </configuration>
            </plugin>
               <plugin>
                   <groupId>org.apache.maven.plugins</groupId>
                   <artifactId>maven-shade-plugin</artifactId>
                   <version>2.4.3</version>
                   <executions>
                       <execution>
                           <phase>package</phase>
                           <goals>
                               <goal>shade</goal>
                           </goals>
                           <configuration>
                               <minimizeJar>true</minimizeJar>
                           </configuration>
                       </execution>
                   </executions>
               </plugin>
        </plugins>
    </build>
</project>
```

</details>

<br/>
2.WordCoutMapperTask.java

<details>
<summary>点击查看代码</summary>

```java
package cn.xiaoma.mapreduce;

import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;

/**
 * Author xiaoma
 * Date 2020/8/22 11:40
 * Desc 1.实现读取文件 2.将数据进行map映射处理
 */
public class WordCoutMapperTask extends Mapper<LongWritable, Text,Text, IntWritable> {
    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        System.out.println("偏移量:"+key.get());
        //1.读取每一行的数据
        String line = value.toString();
        if(StringUtils.isNotEmpty(line)){
            //2.对数据行进行切割操作 ，空格切割
            String[] words = line.split(" ");
            //3.为每个单词进行赋值为1
            for(String word : words){
                context.write(new Text(word),new IntWritable(1));
            }
        }
    }
}

```

</details>
<br/>
3.WordCountReduceTask.java

<details>
<summary>点击查看代码</summary>

```java
package cn.xiaoma.mapreduce;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

/**
 * Author xiaoma
 * Date 2020/8/22 11:51
 * Desc TODO
 */
public class WordCountReduceTask extends Reducer<Text, IntWritable,Text, IntWritable> {
    @Override
    protected void reduce(Text key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {

        int count = 0;
        //1.遍历所有的值
        for(IntWritable v2:values){
            //2.进行累加
            count += v2.get();
        }
        //3.对累加的值进行输出操作
        context.write(key,new IntWritable(count));
    }
}

```

</details>
<br/>
4.WordCountMain.java

<details>
<summary>点击查看代码</summary>

```java
package cn.xiaoma.mapreduce;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import org.apache.hadoop.mapreduce.lib.partition.HashPartitioner;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

/**
 * Author xiaoma
 * Date 2020/8/22 11:59
 * Desc 实现整个业务逻辑的贯通，将map 和 reduce 任务能跑起来，入口类
 * 调用map reduce
 */
public class WordCountMain extends Configured implements Tool {
    public static void main(String[] args) throws Exception{
        //1.基于 tool 调用 run 方法
        Configuration conf = new Configuration();
        //2.运行并返回一个返回码 ,会返回两个值，如果成功就是0 如果失败就非0
        int code = ToolRunner.run(conf, new WordCountMain(), args);
        //3.执行程序，退出程序
        System.exit(code);
    }

    @Override
    public int run(String[] args) throws Exception {
        //1.获取 Job 对象
        Job job = Job.getInstance(super.getConf(), "wordcount");
        //在yarn集群平台运行必备值参数
        job.setJarByClass(WordCountMain.class);
        //2. 天龙八步
        //2.1读取数据的输入格式组件
        job.setInputFormatClass(TextInputFormat.class);
//        TextInputFormat.addInputPath(job,new Path(args[0]));
        TextInputFormat.addInputPath(job,new Path("F:\\Black_House_42\\Blk_BigData_42\\03_Hadoop\\day09_MapReduce\\资料\\wordcount\\input\\wordcount.txt"));
        //2.2设置mapTask
        job.setMapperClass(WordCoutMapperTask.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(IntWritable.class);
        //2.3 设置 shuffle 分区 排序  combine规约 分组
        //2.7 设置reduceTask
        job.setReducerClass(WordCountReduceTask.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);
        //2 .8 输出组件
        job.setOutputFormatClass(TextOutputFormat.class);
        TextOutputFormat.setOutputPath(job,new Path("F:\\Black_House_42\\Blk_BigData_42\\03_Hadoop\\day09_MapReduce\\资料\\wordcount\\output\\wordcount.txt"));
        //3 提交任务
        boolean flag = job.waitForCompletion(true);
        return flag?0:1;
    }
}

```

</details>

## 3 MapReduce程序运行模式

### 3.1 本地运行模式

> 1 mapreduce程序是被提交给LocalJobRunner在本地以单进程的形式运行<br/>
> 2 而处理的数据及输出结果可以在本地文件系统，也可以在hdfs上<br/>
> 3 本地模式非常便于进行业务逻辑的调试

### 3.2 集群运行模式

> 1 将mapreduce程序提交给yarn集群，分发到很多的节点上并发执行<br/>
> 2 处理的数据和输出结果应该位于hdfs文件系统

> 集群运行程序

修改WordCountMain类中的下面两行代码如下图

```
TextInputFormat.addInputPath(job,new Path(args[0]));
TextOutputFormat.setOutputPath(job,new Path(args[1]));
```

1. 上面pom插件将这个jar包中所有依赖的第三方的 jar 包 导入到当前的jar包中，这个 jar 包就叫 肥包。

2. 将这个 jar 包（不是带第三方依赖的小包）上传到 linux 中的任意目录（比如/root/）

3. 在yarn集群中执行 mapreduce。 
  - 执行的脚本可以使用 hadoop jar （1.X） 也可以使用 yarn jar （2.x）运行。
  - 当前wordcount的集群执行命令

```
# 参数说明
# yarn jar 执行的命令
# original-day09_mapreduce1-1.0-SNAPSHOT.jar jar 包
# cn.xiaoma.mapreduce.WordCountMain 全路径类名
# /input/wordcount/wordcount.txt input参数
# /output/wordcount/ output参数
yarn jar original-day09_mapreduce1-1.0-SNAPSHOT.jar cn.xiaoma.mapreduce.WordCountMain /input/wordcount/wordcount.txt /output/wordcount/
```

```
# 开启 mapreduce 的历史服务器命令，查看历史跑过的所有 mapreduce 任务
mr-jobhistory-daemon.sh start historyserver
```

## 4 MapReduce分区

> 分区： 将相同的 k2 的数据发送到同一个分区中

> 物以类聚，人与群分

在 MapReduce 中, 通过我们指定分区, 会将同一个分区的数据发送到同一个Reduce当中进行处理。例如: 为了数据的统计, 可以把一批类似的数据发送到同一个 Reduce 当中, 在同一个 Reduce 当中统计相同类型的数据, 就可以实现类似的数据分区和统计等

其实就是相同类型的数据, 有共性的数据, 送到一起去处理, 在Reduce过程中，可以根据实际需求（比如按某个维度进行归档，类似于数据库的分组），把Map完的数据Reduce到不同的文件中。分区的设置需要与ReduceTaskNum配合使用。比如想要得到5个分区的数据结果。那么就得设置5个ReduceTask。

### 4.1 案例

#### 4.1.1 分析

需求：将文本文件中的彩票数据进行分区，小于等于15的分到一个区里， 大于15的分到另外一个区里，并最终将数据保存到两个文件中。

![彩票分析](/img/articleContent/大数据_MapReduce/7.png)

思路：怎么进行数据的分区？

> mapreduce 默认分区的方式是 hashPartiton

```
(key.hashCode() & Integer.MAX_VALUE) % numReduceTasks;  #默认情况 numReduceTasks =1
```

如何创建自定义分区

1. 创建一个类，继承 Partitioner<K,V>
2. 重写  getPartition 方法
3. 自定义分区规则，小于等于1 5是个规则0，大于15是个规则1
4. 在入口函数在中将分区规则设置到驱动类

#### 4.1.2 实现
<br/>
1.实现分区业务逻辑

<details>
<summary>点击查看代码</summary>

```java
package cn.xiaoma.partition;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Partitioner;

/**
 * Author xiaoma
 * Date 2020/8/22 15:44
 * Desc
 * 输入：mapper输出
 */
public class MyPartition extends Partitioner<IntWritable, Text> {
    /**
     * 根据输入的值 key2 value2 生成分区号
     * @param lotteryResult 彩票结果
     * @param text 每条彩票记录
     * @param numPartitions 分区的个数
     * @return 分区号
     */
    @Override
    public int getPartition(IntWritable lotteryResult, Text text, int numPartitions) {
        /**
         * 根据彩票号进行分区，如果小于等于15进行分区标记为0 否则1
         */
        if(lotteryResult.get()<=15){
            return 0;
        }else{
            return 1;
        }
    }
}

```

</details>

<br/>
2.实现 map 业务逻辑

<details>
<summary>点击查看代码</summary>

```java
package cn.xiaoma.partition;

import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;

/**
 * Author xiaoma
 * Date 2020/8/22 15:53
 * Desc 将当前的文本内容按行进行拆分，得到第6列数据并转换成数字。
 * 默认使用 TextInputFormat 这个格式 key value 默认就是 LongWritable（偏移量）,Text（每行内容）
 * 后面两个IntWritable（根据彩票号）, Text（每行内容）
 * Long,String,Integer,String 对应 LongWritable, Text, IntWritable, Text
 */
public class LotteryMapperTask extends Mapper<LongWritable,Text, IntWritable, Text> {
    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        //1.获取一行
        String line = value.toString();
        if(StringUtils.isNotEmpty(line)){
            //2.对每行数据进行数据的切割操作，获取开奖结果
            String lotteryResult = line.split("\t")[5];
            int code = Integer.parseInt(lotteryResult);
            //3.将数据写出去
            context.write(new IntWritable(code),value);
        }
    }
}

```

</details>

<br/>
3.实现 reduce 的业务逻辑

<details>
<summary>点击查看代码</summary>

```java
package cn.xiaoma.partition;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

/**
 * Author itcast
 * Date 2020/8/22 16:18
 * Desc IntWritable Iterable<Text> Text NullWritable
 */
public class LotteryReducerTask extends Reducer<IntWritable, Text,Text, NullWritable> {
    @Override
    protected void reduce(IntWritable key, Iterable<Text> values, Context context) throws IOException, InterruptedException {
        for(Text value:values){
            context.write(value,NullWritable.get());
        }
    }
}

```

</details>

<br/>
4.实现LotteryMain的业务逻辑 

<details>
<summary>点击查看代码</summary>

```java
package cn.xiaoma.partition;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;

/**
 * Author xiaoma
 * Date 2020/8/22 16:22
 * Desc 彩票的分区需求
 */
public class LotteryMain {
    public static void main(String[] args) throws Exception{
        //1创建job对象
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf, "Lottery ticket MR");
        // 设置提交到yarn集群的
        job.setJarByClass(LotteryMain.class);
        //2.封装 八大步
        //2.1 设置输入类
        job.setInputFormatClass(TextInputFormat.class);
        TextInputFormat.addInputPath(job,new Path(args[0]));
//        TextInputFormat.addInputPath(job,new Path("F:\\Black_House_42\\Blk_BigData_42\\03_Hadoop\\day09_MapReduce\\资料\\自定义分区\\input\\partition.csv"));
        //2.2 设置自定义map类和相关参数
        job.setMapperClass(LotteryMapperTask.class);
        job.setMapOutputKeyClass(IntWritable.class);
        job.setMapOutputValueClass(Text.class);
        //2.3 设置shuffle中的分区
        job.setPartitionerClass(MyPartition.class);
        //2.4 排序、combine、分组
        //2.7 设置reduce类和相关参数
        job.setReducerClass(LotteryReducerTask.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(NullWritable.class);
        //2.8 设置输出类
        job.setOutputFormatClass(TextOutputFormat.class);
        TextOutputFormat.setOutputPath(job,new Path(args[1]));
//        TextOutputFormat.setOutputPath(job,new Path("F:\\Black_House_42\\Blk_BigData_42\\03_Hadoop\\day09_MapReduce\\资料\\自定义分区\\output"));
        //2.9 设置使用分区数，自定义2个分区
        job.setNumReduceTasks(2);
        //3 提交任务
        boolean flag = job.waitForCompletion(true);
        int i = flag ? 0 : 1;
        System.exit(i);
    }
}

```

</details>

<br/>

5.数据准备

```
hdfs dfs -mkdir -p /input/partition
hdfs dfs -put partition.txt /input/partition/partition.csv
```

6.执行 shell 脚本

```shell
yarn jar original-day09_mapreduce1-1.0-SNAPSHOT.jar cn.xiaoma.partition.LotteryMain /input/partition/partition.csv /output/partition
```

## 5 MapReduce排序和序列化

### 5.1 概述

`序列化`（Serialization）是指把结构化对象转化为字节流。

`反序列化`（Deserialization）是序列化的逆过程。把字节流转为结构化对象。
当要在进程间传递对象或持久化对象的时候，就需要序列化对象成字节流，反之当要将接收到或从磁盘读取的字节流转换为对象，就要进行反序列化。

Java的序列化（Serializable）是一个重量级序列化框架，一个对象被序列化后，会附带很多额外的信息（各种校验信息，header，继承体系…），不便于在网络中高效传输；所以，hadoop自己开发了一套序列化机制（Writable），精简，高效。不用像java对象类一样传输多层的父子关系，需要哪个属性就传输哪个属性值，大大的减少网络传输的开销。

### 5.1 案例

> 这个就不在服务器跑了，跑的流程都一样，看下上面的案例就好，换下文件的路径，yarn jar 跑一下就好了

#### 5.1.1 需求

> 将数据进行排列，第一列降序排列，如果相等的情况下，第二列进行升序排列，输出到文件

![排序需求](/img/articleContent/大数据_MapReduce/8.png)

#### 5.1.2 分析

> 实现SortPojo 类 思路：

- 实现自定义的bean来封装数据，并将bean作为map输出的key来传输
- MR程序在处理数据的过程中会对数据排序(map输出的kv对传输到reduce之前，会排序)，排序的依据是map输出的key。所以，我们如果要实现自己需要的排序规则，则可以考虑将排序因素放到key中，让key实现接口：WritableComparable，然后重写key的compareTo方法。

#### 5.1.3 实现

<br/>
1.SortPojo类
<details>
<summary>点击查看代码</summary>

```java
package cn.itcast.sort;

import org.apache.hadoop.io.WritableComparable;

import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;

/**
 * Author itcast
 * Date 2020/8/22 16:54
 * Desc Sort 对象，实现了字段的排序和比较
 */
public class SortPojo implements WritableComparable<SortPojo> {
    private String first;
    private String second;

    public SortPojo() {
    }

    public String getFirst() {
        return first;
    }

    public void setFirst(String first) {
        this.first = first;
    }

    public String getSecond() {
        return second;
    }

    public void setSecond(String second) {
        this.second = second;
    }

    @Override
    public String toString() {
        return first + "\t" +second;
    }

    /**
     * 排序的方法，如果第一列不相等，根据字典顺序降序排列
     * 如果第一列相同的清空下，第二列升序排列
     * 如果 this.first.comparaTo(o.first)  升序排列
     * 如果 o.first.comparaTo(this.first)  降序排列
     * @param o
     * @return
     */
    @Override
    public int compareTo(SortPojo o) {
        //比较之后有三个值
        //如果是 i>0 代表o.first大于this.first
        //如果是 i<0 代表this.first大于o.first
        //如果i==0 说明两个值相等
        int i = o.first.compareTo(this.first);
        if( i == 0){
            int i1 = this.second.compareTo(o.second);
            return i1;
        }
        return i;
    }

    @Override
    public void write(DataOutput out) throws IOException {
        out.writeUTF(first);
        out.writeUTF(second);
    }

    @Override
    public void readFields(DataInput in) throws IOException {
        this.first = in.readUTF();
        this.second = in.readUTF();
    }
}

```
</details>

<br/>
2.SortMapperTask 类的实现
<details>
<summary>点击查看代码</summary>

```
package cn.itcast.sort;

import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;

/**
 * Author itcast
 * Date 2020/8/22 16:54
 * Desc
 * 输入: <偏移量,文本,排序对象,空></>
 */
public class SortMapperTask extends Mapper<LongWritable, Text,SortPojo, NullWritable> {
    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        //1.获取行数据
        String line = value.toString();
        if(StringUtils.isNotEmpty(line)){
            //2.切割数据
            String[] sortPojoArr = line.split("\t");
            //3.封装对象并发送数据
            SortPojo sortPojo = new SortPojo();
            sortPojo.setFirst(sortPojoArr[0]);
            sortPojo.setSecond(sortPojoArr[1]);
            context.write(sortPojo, NullWritable.get());
        }

    }
}

```
</details>

<br/>
3.SortReduceTask 的实现
<details>
<summary>点击查看代码</summary>

```
package cn.itcast.sort;

import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

/**
 * Author itcast
 * Date 2020/8/22 17:13
 * Desc TODO
 */
public class SortReduceTask extends Reducer<SortPojo, NullWritable,SortPojo, NullWritable> {
    @Override
    protected void reduce(SortPojo key, Iterable<NullWritable> values, Context context) throws IOException, InterruptedException {
        for(NullWritable n:values){
            context.write(key,n);
        }
    }
}

```
</details>

<br/>
4.SortMain 类的实现
<details>
<summary>点击查看代码</summary>

```
package cn.itcast.sort;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;

/**
 * Author itcast
 * Date 2020/8/22 17:14
 * Desc 实现主要的封装操作
 */
public class SortMain {
    public static void main(String[] args) throws Exception {
        //1.创建job对象
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf, "sort MR");
        //2.设置 job 的八大步  天龙八部
        //2.1 设置输入类
        job.setInputFormatClass(TextInputFormat.class);
//        TextInputFormat.addInputPath(job,new Path(args[0]));
        TextInputFormat.addInputPath(job,new Path("F:\\Black_House_42\\Blk_BigData_42\\03_Hadoop\\day09_MapReduce\\资料\\排序\\input\\sort.txt"));
        //2.2 设置mapper
        job.setMapperClass(SortMapperTask.class);
        job.setMapOutputKeyClass(SortPojo.class);
        job.setMapOutputValueClass(NullWritable.class);
        //2.3 设置shuffle 分区 排序 combine 分组

        //2.7 设置reducer
        job.setReducerClass(SortReduceTask.class);
        job.setOutputKeyClass(SortPojo.class);
        job.setOutputValueClass(NullWritable.class);
        //3. 文件输出格式
        job.setOutputFormatClass(TextOutputFormat.class);
//        TextOutputFormat.setOutputPath(job,new Path(args[1]));
        TextOutputFormat.setOutputPath(job,new Path("F:\\Black_House_42\\Blk_BigData_42\\03_Hadoop\\day09_MapReduce\\资料\\排序\\output"));
        // 提交任务
        boolean flag = job.waitForCompletion(true);
        //退出
        System.exit(flag?0:1);
    }
}

```
</details>

<br/>

![排序结果](/img/articleContent/大数据_MapReduce/9.png)


## 联系博主，加入【羊山丨交流社区】
![联系博主](/img/icon/wechatFindMe.png)