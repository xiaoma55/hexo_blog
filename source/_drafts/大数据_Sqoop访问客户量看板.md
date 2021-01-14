---
title: 大数据_访问客户量看板
index_img: /img/articleBg/1(45).jpg
banner_img: /img/articleBg/1(45).jpg
tags:
  - 标签一
  - 标签一
category:
  - - 一级分类
    - 二级分类
  - - 一级分类
    - 二级分类
  - - 一级分类
comment: 'off'
date: 2021-01-06 19:27:12
---

写摘要，就是首页显示的那个

<!-- more -->

## 1 原始数据结构

> 访问客户量的数据来源于咨询系统的访问会话月表`web_chat_ems`，表名的格式为web_chat_ems_年_月，年份为4位数字，月份为二位数字，如果为单数时，前面会用0来补全，比如`web_chat_ems_2019_07`。

> `web_chat_text_ems`表是访问附属月表，表名的格式和web_chat_ems相同。web_chat_ems和web_chat_text_ems是一一对应的，通过主键id进行关联。

![image](FE41E52DE7B0473298BBC4D62AEF9901)

### 1.1 插入原始数据

> 以下所有例子用到的数据，脚本在下面地址

```shell
链接：https://pan.baidu.com/s/1Aun3484H51AGgwvKgvCX3Q 
提取码：6666 
复制这段内容后打开百度网盘手机App，操作更方便哦--来自百度网盘超级会员V3的分享
```

![image](373A79C397334FF8AC8BC49A1CF8903B)

> 插入原始数据

```
source nev.sql
```

### 1.2 表结构概览

> web_chat_ems表结构

```
id                           int auto_increment comment '主键'        primary key,
create_date_time             timestamp                                null comment '数据创建时间',
session_id                   varchar(48)                   default '' not null comment '会话系统sessionId',
sid                          varchar(48) collate utf8_bin  default '' not null comment '访客id',
create_time                  datetime                                 null comment '会话创建时间',
seo_source                   varchar(255) collate utf8_bin default '' null comment '搜索来源',
seo_keywords                 varchar(512) collate utf8_bin default '' null comment '关键字',
ip                           varchar(48) collate utf8_bin  default '' null comment 'IP地址',
area                         varchar(255) collate utf8_bin default '' null comment '地域',
country                      varchar(16) collate utf8_bin  default '' null comment '所在国家',
province                     varchar(16) collate utf8_bin  default '' null comment '省',
city                         varchar(255) collate utf8_bin default '' null comment '城市',
origin_channel               varchar(32) collate utf8_bin  default '' null comment '来源渠道(广告)',
user                         varchar(255) collate utf8_bin default '' null comment '所属坐席',
manual_time                  datetime                                 null comment '人工开始时间',
begin_time                   datetime                                 null comment '坐席领取时间 ',
end_time                     datetime                                 null comment '会话结束时间',
last_customer_msg_time_stamp datetime                                 null comment '客户最后一条消息的时间',
last_agent_msg_time_stamp    datetime                                 null comment '坐席最后一下回复的时间',
reply_msg_count              int(12)                       default 0  null comment '客服回复消息数',
msg_count                    int(12)                       default 0  null comment '客户发送消息数',
browser_name                 varchar(255) collate utf8_bin default '' null comment '浏览器名称',
os_info                      varchar(255) collate utf8_bin default '' null comment '系统名称'
```

> web_chat_text_ems表结构

```
id                   int                   not null comment '主键'       primary key,
referrer             text collate utf8_bin null comment '上级来源页面',
from_url             text collate utf8_bin null comment '会话来源页面',
landing_page_url     text collate utf8_bin null comment '访客着陆页面',
url_title            text collate utf8_bin null comment '咨询页面title',
platform_description text collate utf8_bin null comment '客户平台信息',
other_params         text collate utf8_bin null comment '扩展字段中数据',
history              text collate utf8_bin null comment '历史访问记录'
```

## 2 访问客户量实现

### 2.1 建模

#### 2.1.1 指标和维度

> 指标：

访问客户量是单位时间内访问网站的去重后客户数量，以天为单位显示访问客户。

> 维度：

时间维度：年、季度、月、天、小时

业务属性维度：地区、来源渠道、搜索来源、会话来源页面、总访问量。

#### 2.1.2 事实表和维度表

> 事实表的数据就是指标数据，访问客户量指标的事实表就是我们的客户访问表。

> 而维度数据都包含在事实表中，没有需要额外关联的维度表。

#### 2.1.3 分层

> 数据库命名`统一加上前缀`xiaoma，在实际场景中，将此`前缀替换为系统的简`称即可。比如：edu_ods、edu_dwd、edu_dws等。

> `ODS层`是原始数据，一般不允许修改，所以`使用外部表`保证数据的安全性，避免误删除；`DW和APP`层是统计数据，为了使覆盖插入等操作更方便，满足业务需求的同时，提高开发和测试效率，推荐`使用内部表`。

![image](EADB8303C2BD4475801B057DA8FF8048)

##### 2.1.3.1 ODS层

> 从咨询系统OLTP数据库的web_chat_ems_20XX_XX等月表中抽取的原始数据；

> 离线数仓大多数的场景都是T+1，`为了便于后续的DW层清洗数据时，快速获取昨天的数据`，ODS模型要在原始mysql表的基础之上`增加starts_time`抽取日期字段，并且可以`使用starts_time字段`分区以提升查询的性能。

###### 2.1.3.1.1 建库

```sql
CREATE DATABASE IF NOT EXISTS `xiaoma_ods`;
```

###### 2.1.3.1.2 建表web_chat_ems

> 建表时，要`注意字段名不要采用关键`字，比如原始mysql表中有一个`user`字段，我们需要将它修改为`user_match`。

> `注意`，设置ORC压缩格式前一定要先设置hive.exec.orc.compression.strategy，否则压缩不生效：

```
--写入时压缩生效
set hive.exec.orc.compression.strategy=COMPRESSION;
```

> `注意下面把原始mysql中的user字段改为了user_match字段`

```sql
CREATE EXTERNAL TABLE IF NOT EXISTS xiaoma_ods.web_chat_ems (
  id INT comment '主键',
  create_date_time STRING comment '数据创建时间',
  session_id STRING comment '七陌sessionId',
  sid STRING comment '访客id',
  create_time STRING comment '会话创建时间',
  seo_source STRING comment '搜索来源',
  seo_keywords STRING comment '关键字',
  ip STRING comment 'IP地址',
  area STRING comment '地域',
  country STRING comment '所在国家',
  province STRING comment '省',
  city STRING comment '城市',
  origin_channel STRING comment '投放渠道',
  user_match STRING comment '所属坐席',
  manual_time STRING comment '人工开始时间',
  begin_time STRING comment '坐席领取时间 ',
  end_time STRING comment '会话结束时间',
  last_customer_msg_time_stamp STRING comment '客户最后一条消息的时间',
  last_agent_msg_time_stamp STRING comment '坐席最后一下回复的时间',
  reply_msg_count INT comment '客服回复消息数',
  msg_count INT comment '客户发送消息数',
  browser_name STRING comment '浏览器名称',
  os_info STRING comment '系统名称')
comment '访问会话信息表'
PARTITIONED BY(starts_time STRING)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY '\t'
stored as orc
location '/user/hive/warehouse/xiaoma_ods.db/web_chat_ems_ods'
TBLPROPERTIES ('orc.compress'='ZLIB');
```

###### 2.1.3.1.3 建表web_chat_text_ems

```sql
CREATE EXTERNAL TABLE IF NOT EXISTS xiaoma_ods.web_chat_text_ems (
  id INT COMMENT '主键来自MySQL',
  referrer STRING comment '上级来源页面',
  from_url STRING comment '会话来源页面',
  landing_page_url STRING comment '访客着陆页面',
  url_title STRING comment '咨询页面title',
  platform_description STRING comment '客户平台信息',
  other_params STRING comment '扩展字段中数据',
  history STRING comment '历史访问记录'
) comment 'EMS-PV测试表'
PARTITIONED BY(start_time STRING)
ROW FORMAT DELIMITED 
FIELDS TERMINATED BY '\t'
stored as orc
location '/user/hive/warehouse/xiaoma_ods.db/web_chat_text_ems_ods'
TBLPROPERTIES ('orc.compress'='ZLIB');
```

##### 2.1.3.2 DWD层

> 维度：

- 时间维度：年、季度、月、天、小时
- 业务属性维度：地区、来源渠道、搜索来源、会话来源页面、总访问量。

> 将ODS层数据，进行`清洗转换`，并且`将web_chat_ems主表和web_chat_text_ems附表的内容根据id合并在一起`。数据粒度保持不变。

> 数据清洗：空数据、不满足业务需求的数据处理。

> 数据转换：数据格式和数据形式的转换，比如时间类型可以转换为同样的展现形式“yyyy-MM-dd HH:mm:ss”或者时间戳类型，金钱类型的数据可以统一转换为以元为单位或以分为单位的数值。

###### 2.1.3.2.1 建库

```sql
CREATE DATABASE IF NOT EXISTS `xiaoma_dwd`
WITH DBPROPERTIES ( 'creator' = 'kongshuai', 'create_date' = '2020-05-05');
```

###### 2.1.3.2.1 建表

```sql
create table if not exists xiaoma_dwd.visit_consult_dwd(
  session_id STRING comment '七陌sessionId',
  sid STRING comment '访客id',
  create_time bigint comment '会话创建时间',
  seo_source STRING comment '搜索来源',
  ip STRING comment 'IP地址',
  area STRING comment '地域',
  msg_count int comment '客户发送消息数',
  origin_channel STRING COMMENT '来源渠道',
  referrer STRING comment '上级来源页面',
  from_url STRING comment '会话来源页面',
  landing_page_url STRING comment '访客着陆页面',
  url_title STRING comment '咨询页面title',
  platform_description STRING comment '客户平台信息',
  other_params STRING comment '扩展字段中数据',
  history STRING comment '历史访问记录',
  hourinfo string comment '小时',
  quarterinfo string comment '季度'
)
comment '访问咨询DWD表'
partitioned by(yearinfo String, monthinfo String, dayinfo string)
row format delimited fields terminated by '\t'
stored as orc
location '/user/hive/warehouse/xiaoma_dwd.db/visit_consult_dwd'
tblproperties ('orc.compress'='SNAPPY');
```

##### 2.1.3.3 DWS层

> 在DWD层的基础上，按照业务的要求进行`统计分析`；时间和业务属性三个维度分类，可以在模型中增加对应的属性标识：

- 时间维度：1.年、2.季度、3.月、4.天、5.小时
- 业务属性维度：1.地区、2.来源渠道、3.搜索来源、4.会话来源页面、5.总访问量

###### 2.1.3.3.1 建库

```sql
CREATE DATABASE IF NOT EXISTS `xiaoma_dws`
WITH DBPROPERTIES ( 'creator' = 'kongshuai', 'create_date' = '2020-05-05');
```

###### 2.1.3.3.2 建表

```sql
CREATE TABLE IF NOT EXISTS xiaoma_dws.visit_dws (
  sid_total INT COMMENT '根据sid去重求count',
  sessionid_total INT COMMENT '根据sessionid去重求count',
  ip_total INT COMMENT '根据IP去重求count',
  area STRING COMMENT '区域信息',
  seo_source STRING COMMENT '搜索来源',
  origin_channel STRING COMMENT '来源渠道',
  hourinfo STRING COMMENT '创建时间，统计至小时',
  quarterinfo STRING COMMENT '季度',
  time_str STRING COMMENT '时间明细',
  from_url STRING comment '会话来源页面',
  groupType STRING COMMENT '产品属性类型：1.地区；2.搜索来源；3.来源渠道；4.会话来源页面；5.总访问量',
  time_type STRING COMMENT '时间聚合类型：1、按小时聚合；2、按天聚合；3、按月聚合；4、按季度聚合；5、按年聚合；')
comment 'EMS访客日志dws表'
PARTITIONED BY(yearinfo STRING,monthinfo STRING,dayinfo STRING)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY '\t'
stored as orc
location '/user/hive/warehouse/xiaoma_dws.db/visit_dws'
TBLPROPERTIES ('orc.compress'='SNAPPY');
```

##### 2.1.3.4 APP层

> 如果用户需要具体的报表展示，可以针对不同的报表页面设计APP层结构，然后导出至OLAP系统的mysql中。此系统使用FineBI，需要通过宽表来进行灵活的展现。因此APP层不再进行细化。直接将DWS层导出至mysql即可。

### 2.2 全量流程

> OLTP原始数据(mysql)——》数据采集(ODS)——》清洗转换(DWD)——》统计分析(DWS)——》导出至OLAP(Mysql)，如图：

![image](F8C3B9A2B50543FB8C12B710D03BCA7B)

#### 2.2.1 数据采集

##### 2.2.1.1 web_chat_ems表

> sql

```sql
select id,
       referrer,
       from_url,
       landing_page_url,
       url_title,
       platform_description,
       other_params,
       history,
       "2019-07-01" as start_time
from web_chat_text_ems_2019_07;
```

> sqoop

```
sqoop import \
--connect jdbc:mysql://192.168.52.150:3306/nev \
--username root \
--password 123456 \
--query 'select id,referrer,from_url,landing_page_url,url_title,platform_description,other_params,history, "2019-07-01" as start_time from web_chat_text_ems_2019_07 where $CONDITIONS' \
--fields-terminated-by '\t' \
--hcatalog-database xiaoma_ods \
--hcatalog-table web_chat_text_ems \
--hcatalog-storage-stanza 'stored as orc tblproperties ("orc.compress"="ZLIB")' \
-m 100 \
--split-by id
```

##### 2.2.1.2 web_chat_text_ems表

> sql

```sql
select id,
       referrer,
       from_url,
       landing_page_url,
       url_title,
       platform_description,
       other_params,
       history,
       "2019-07-01" as start_time
from web_chat_text_ems_2019_07;
```

> sqoop

```
sqoop import \
--connect jdbc:mysql://192.168.52.150:3306/nev \
--username root \
--password 123456 \
--query 'select id,referrer,from_url,landing_page_url,url_title,platform_description,other_params,history, "2019-07-01" as start_time from web_chat_text_ems_2019_07 where $CONDITIONS' \
--fields-terminated-by '\t' \
--hcatalog-database xiaoma_ods \
--hcatalog-table web_chat_text_ems \
--hcatalog-storage-stanza 'stored as orc tblproperties  \ ("orc.compress"="ZLIB")' \
-m 100 \
--split-by id
```

#### 2.2.2 数据清洗转换

##### 2.2.2.1 分析

> 从ODS层到DWD层，`数据粒度是一致的`，并且要保证数据的质量。主要做两件事：

> 1.数据清洗：空数据、不满足业务需求的数据处理

对于访问客户量指标，`已知的原始数据是经过`咨询业务系统严格清洗过的数据，所以此处可以`省略清洗过程`。

> 2.数据转换：数据格式和数据形式的转换，比如时间类型可以转换为同样的展现形式“yyyy-MM-dd HH:mm:ss”或者时间戳类型，金钱类型的数据可以统一转换为以元为单位或以分为单位的数值。

![image](75C141791242411F91022E90435D7FD2)

##### 2.2.2.1 代码

```
--动态分区配置
set hive.exec.dynamic.partition=true;
set hive.exec.dynamic.partition.mode=nonstrict;
--hive压缩
set hive.exec.compress.intermediate=true;
set hive.exec.compress.output=true;
--写入时压缩生效
set hive.exec.orc.compression.strategy=COMPRESSION;


insert overwrite table xiaoma_dwd.visit_consult_dwd partition (yearinfo, monthinfo, dayinfo)
select
    wce.session_id,
    wce.sid,
    unix_timestamp(wce.create_time, 'yyyy-MM-dd HH:mm:ss.SSS') as create_time,  
wce.origin_channel,
    wce.seo_source,
    wce.ip,
    wce.area,
    cast(if(wce.msg_count is null, 0, wce.msg_count) as int) as msg_count,
    wcte.referrer,
    wcte.from_url,
    wcte.landing_page_url,
    wcte.url_title,
    wcte.platform_description,
    wcte.other_params,
    wcte.history,
    substr(wce.create_time, 12, 2) as hourinfo,
    quarter(wce.create_time) as quarterinfo,
    substr(wce.create_time, 1, 4) as yearinfo,
    substr(wce.create_time, 6, 2) as monthinfo,
    substr(wce.create_time, 9, 2) as dayinfo
from xiaoma_ods.web_chat_ems wce left join xiaoma_ods.web_chat_text_ems wcte
on wce.id = wcte.id;
```

##### 2.2.2.1 问题

> 过多的动态分区会导致如下错误：

```
Error: java.lang.RuntimeException: org.apache.hadoop.hive.ql.
metadata.HiveFatalException: [Error 20004]: Fatal error occurred when node tried to create too many dynamic partitions. The maximum number of dynamic partitions is controlled by hive.exec.max.dynamic.partitions and hive.exec.max.dynamic.partitions.pernode. Maximum was set to: 100
```

> 解决

```
set hive.exec.max.dynamic.partitions.pernode=10000;
set hive.exec.max.dynamic.partitions=100000;
```

> Hive动态分区创建文件数过多错误：

```
[Fatal Error] total number of created files now is 100385, which exceeds 100000. Killing the job.
```

> 解决

```
set hive.exec.max.created.files=150000;
```

#### 2.2.3 统计分析

##### 2.2.3.1 分析

> DWD层之后是DWM中间层和DWS业务层。回顾建模分析阶段，我们已经得到了指标相关的维度：年、季度、月、天、小时、地区、来源渠道、页面。分两大类：

- 时间维度：年、季度、月、天、小时
- 业务属性维度：地区、来源渠道、页面、总访问量。
-
> 在DWS层`按照不同维度`使用count+distinct来`统计指标，形成宽表`。

> `空值处理`

事实表中的维度关联键不能存在空值，否则会违反参照完整性，关联的维度信息`必须用代理键（-1）而不是空值表示未知的条件`。

##### 2.2.3.2 代码

> 我们的维度一共有两大类：时间维度和产品属性维度，在DWS层我们可以产出一个宽表，将所有维度的数据都生成出来，供APP层和OLAP应用来使用。

###### 2.2.3.2.1 地区分组

> 统计地区维度时，需要设置`产品属性类型groupType为1（地区）`，同时`将其他产品属性设置为-1`（搜索来源、来源渠道、会话来源页面），便于团队理解，减少自己和团队出错率的同时也降低了沟通成本。

> 在insertsql中，尽量为查询出的字段加上别名，特别是字段多的表，便于识别。

> 小时维度

```
--分区
SET hive.exec.dynamic.partition=true;
SET hive.exec.dynamic.partition.mode=nonstrict;
set hive.exec.max.dynamic.partitions.pernode=10000;
set hive.exec.max.dynamic.partitions=100000;
set hive.exec.max.created.files=150000;
--hive压缩
set hive.exec.compress.intermediate=true;
set hive.exec.compress.output=true;
--写入时压缩生效
set hive.exec.orc.compression.strategy=COMPRESSION;

insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select
    count(distinct sid)        as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip)         as ip_total,
    area,
    '-1' as seo_source,
    '-1' as origin_channel,
    hourinfo,
    quarterinfo,
    concat(yearinfo,'-',monthinfo,'-',dayinfo,' ',hourinfo) as time_str,
    '-1' as from_url,
    '1' as grouptype,
    '1' as time_type,
    yearinfo, monthinfo, dayinfo
from xiaoma_dwd.visit_consult_dwd
group by area, yearinfo, quarterinfo, monthinfo, dayinfo, hourinfo;
```

> 天维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select 
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    area,
    '-1' as seo_source,
    '-1' as origin_channel,
    '-1' as hourinfo,
    quarterinfo,
    concat(yearinfo,'-',monthinfo,'-',dayinfo) as time_str,
    '-1' as from_url,
    '1' as grouptype,
    '2' as time_type,
    yearinfo, monthinfo, dayinfo
from xiaoma_dwd.visit_consult_dwd 
group by area, yearinfo, quarterinfo, monthinfo, dayinfo;
```

> 月维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select 
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    area,
    '-1' as seo_source,
    '-1' as origin_channel,
    '-1' as hourinfo,
    quarterinfo,
    concat(yearinfo,'-',monthinfo) as time_str,
    '-1' as from_url,
    '1' as grouptype,
    '3' as time_type,
    yearinfo, monthinfo,
    '-1' as dayinfo
from xiaoma_dwd.visit_consult_dwd 
group by area, yearinfo, quarterinfo, monthinfo;
```

> 季度维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select 
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    area,
    '-1' as seo_source,
    '-1' as origin_channel,
    '-1' as hourinfo,
    quarterinfo,
    concat(yearinfo,'-Q',quarterinfo) as time_str,
    '-1' as from_url,
    '1' as grouptype,
    '4' as time_type,
    yearinfo,
    '-1' as monthinfo,
    '-1' as dayinfo
from xiaoma_dwd.visit_consult_dwd 
group by area, yearinfo, quarterinfo;
```

> 年维度

```
INSERT  INTO TABLE xiaoma_dws.visit_dws PARTITION (yearinfo,monthinfo,dayinfo)
select 
   COUNT(DISTINCT wce.sid) as sid_total,
   COUNT(DISTINCT wce.session_id) as sessionid_total,
   COUNT(DISTINCT wce.ip) as ip_total,
   wce.area as area,
   '-1' as seo_source,
   '-1' as origin_channel,
   '-1' as hourinfo,
   '-1' as quarterinfo,
   wce.yearinfo as time_str,
   '-1' as from_url,
   '1' as groupType,
   '5' as time_type,
   wce.yearinfo as yearinfo,
   '-1' as monthinfo,
   '-1' as dayinfo
from xiaoma_dwd.visit_consult_dwd wce
group by wce.area,wce.yearinfo;
```

###### 2.2.3.2.2 搜索来源分组

> 小时维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select 
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    '-1' as area,
    seo_source,
    '-1' as origin_channel,
    hourinfo,
    quarterinfo,
    concat(yearinfo,'-',monthinfo,'-',dayinfo,' ',hourinfo) as time_str,
    '-1' as from_url,
    '2' as grouptype,
    '1' as time_type,
    yearinfo, monthinfo, dayinfo
from xiaoma_dwd.visit_consult_dwd 
group by seo_source, yearinfo, quarterinfo, monthinfo, dayinfo, hourinfo;
```

> 天维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    '-1' as area,
    seo_source,
    '-1' as origin_channel,
    '-1' as hourinfo,
    quarterinfo,
    concat(yearinfo,'-',monthinfo,'-',dayinfo) as time_str,
    '-1' as from_url,
    '2' as grouptype,
    '2' as time_type,
    yearinfo, monthinfo, dayinfo
from xiaoma_dwd.visit_consult_dwd
group by seo_source, yearinfo, quarterinfo, monthinfo, dayinfo;
```

> 月维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    '-1' as area,
    seo_source,
    '-1' as origin_channel,
    '-1' as hourinfo,
    quarterinfo,
    concat(yearinfo,'-',monthinfo) as time_str,
    '-1' as from_url,
    '2' as grouptype,
    '3' as time_type,
    yearinfo, monthinfo,
    '-1' as dayinfo
from xiaoma_dwd.visit_consult_dwd
group by seo_source, yearinfo, quarterinfo, monthinfo;
```

> 季度维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    '-1' as area,
    seo_source,
    '-1' as origin_channel,
    '-1' as hourinfo,
    quarterinfo,
    concat(yearinfo,'-Q',quarterinfo) as time_str,
    '-1' as from_url,
    '2' as grouptype,
    '4' as time_type,
    yearinfo,
    '-1' as monthinfo,
    '-1' as dayinfo
from xiaoma_dwd.visit_consult_dwd
group by seo_source, yearinfo, quarterinfo;
```

> 年维度

```
INSERT  INTO TABLE xiaoma_dws.visit_dws PARTITION (yearinfo,monthinfo,dayinfo)
select
   COUNT(DISTINCT wce.sid) as sid_total,
   COUNT(DISTINCT wce.session_id) as sessionid_total,
   COUNT(DISTINCT wce.ip) as ip_total,
   '-1' as  area,
   seo_source,
   '-1' as origin_channel,
   '-1' as hourinfo,
   '-1' as quarterinfo,
   wce.yearinfo as time_str,
   '-1' as from_url,
   '2' as groupType,
   '5' as time_type,
   wce.yearinfo as yearinfo,
   '-1' as monthinfo,
   '-1' as dayinfo
from xiaoma_dwd.visit_consult_dwd wce
group by wce.seo_source,wce.yearinfo;
```

###### 2.2.3.2.3 来源渠道分组

> 小时维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    '-1' as area,
    '-1' as seo_source,
    origin_channel,
    hourinfo,
    quarterinfo,
    concat(yearinfo,'-',monthinfo,'-',dayinfo,' ',hourinfo) as time_str,
    '-1' as from_url,
    '3' as grouptype,
    '1' as time_type,
    yearinfo, monthinfo, dayinfo
from xiaoma_dwd.visit_consult_dwd
group by origin_channel, yearinfo, quarterinfo, monthinfo, dayinfo, hourinfo;
```

> 天维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    '-1' as area,
    '-1' as seo_source,
    origin_channel,
    '-1' as hourinfo,
    quarterinfo,
    concat(yearinfo,'-',monthinfo,'-',dayinfo) as time_str,
    '-1' as from_url,
    '3' as grouptype,
    '2' as time_type,
    yearinfo, monthinfo, dayinfo
from xiaoma_dwd.visit_consult_dwd
group by origin_channel, yearinfo, quarterinfo, monthinfo, dayinfo;
```

> 月维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    '-1' as area,
    '-1' as seo_source,
    origin_channel,
    '-1' as hourinfo,
    quarterinfo,
    concat(yearinfo,'-',monthinfo) as time_str,
    '-1' as from_url,
    '3' as grouptype,
    '3' as time_type,
    yearinfo, monthinfo,
    '-1' as dayinfo
from xiaoma_dwd.visit_consult_dwd
group by origin_channel, yearinfo, quarterinfo, monthinfo;
```

> 季度维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    '-1' as area,
    '-1' as seo_source,
    origin_channel,
    '-1' as hourinfo,
    quarterinfo,
    concat(yearinfo,'-Q',quarterinfo) as time_str,
    '-1' as from_url,
    '3' as grouptype,
    '4' as time_type,
    yearinfo,
    '-1' as monthinfo,
    '-1' as dayinfo
from xiaoma_dwd.visit_consult_dwd
group by origin_channel, yearinfo, quarterinfo;
```

> 年维度

```
INSERT  INTO TABLE xiaoma_dws.visit_dws PARTITION (yearinfo,monthinfo,dayinfo)
select
   COUNT(DISTINCT wce.sid) as sid_total,
   COUNT(DISTINCT wce.session_id) as sessionid_total,
   COUNT(DISTINCT wce.ip) as ip_total,
   '-1' as  area,
   '-1' as seo_source,
   origin_channel,
   '-1' as hourinfo,
   '-1' as quarterinfo,
   wce.yearinfo as time_str,
   '-1' as from_url,
   '3' as groupType,
   '5' as time_type,
   wce.yearinfo as yearinfo,
   '-1' as monthinfo,
   '-1' as dayinfo
from xiaoma_dwd.visit_consult_dwd wce
group by wce.origin_channel,wce.yearinfo;
```

###### 2.2.3.2.4 会话来源页面分组

> 小时维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select 
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    '-1' as area,
    '-1' as seo_source,
    '-1' as origin_channel,
    hourinfo,
    quarterinfo,
    concat(yearinfo,'-',monthinfo,'-',dayinfo,' ',hourinfo) as time_str,
    from_url,
    '4' as grouptype,
    '1' as time_type,
    yearinfo, monthinfo, dayinfo
from xiaoma_dwd.visit_consult_dwd 
group by from_url, yearinfo, quarterinfo, monthinfo, dayinfo, hourinfo;
```

> 天维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    '-1' as area,
    '-1' as seo_source,
    '-1' as origin_channel,
    '-1' as hourinfo,
    quarterinfo,
    concat(yearinfo,'-',monthinfo,'-',dayinfo) as time_str,
    from_url,
    '4' as grouptype,
    '2' as time_type,
    yearinfo, monthinfo, dayinfo
from xiaoma_dwd.visit_consult_dwd
group by from_url, yearinfo, quarterinfo, monthinfo, dayinfo;
```

> 月维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    '-1' as area,
    '-1' as seo_source,
    '-1' as origin_channel,
    '-1' as hourinfo,
    quarterinfo,
    concat(yearinfo,'-',monthinfo) as time_str,
    from_url,
    '4' as grouptype,
    '3' as time_type,
    yearinfo, monthinfo,
    '-1' as dayinfo
from xiaoma_dwd.visit_consult_dwd
group by from_url, yearinfo, quarterinfo, monthinfo;
```

> 季度维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    '-1' as area,
    '-1' as seo_source,
    '-1' as origin_channel,
    '-1' as hourinfo,
    quarterinfo,
    concat(yearinfo,'-Q',quarterinfo) as time_str,
    from_url,
    '4' as grouptype,
    '4' as time_type,
    yearinfo,
    '-1' as monthinfo,
    '-1' as dayinfo
from xiaoma_dwd.visit_consult_dwd
group by from_url, yearinfo, quarterinfo;
```

> 年维度

```
INSERT  INTO TABLE xiaoma_dws.visit_dws PARTITION (yearinfo,monthinfo,dayinfo)
select
   COUNT(DISTINCT wce.sid) as sid_total,
   COUNT(DISTINCT wce.session_id) as sessionid_total,
   COUNT(DISTINCT wce.ip) as ip_total,
   '-1' as  area,
   '-1' as seo_source,
   '-1' as origin_channel,
   '-1' as hourinfo,
   '-1' as quarterinfo,
   wce.yearinfo as time_str,
   from_url,
   '4' as groupType,
   '5' as time_type,
   wce.yearinfo as yearinfo,
   '-1' as monthinfo,
   '-1' as dayinfo
from xiaoma_dwd.visit_consult_dwd wce
group by wce.from_url,wce.yearinfo;
```

###### 2.2.3.2.5 总访问量

> 小时（小时段区间的基础数据）

> 因为小时段数据可以直接sum求和，因此OLAP应用可以在小时数据基础上，进行简单的sum操作以获取到区间小时段数据。

> 小时维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select 
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    '-1' as area,
    '-1' as seo_source,
    '-1' as origin_channel,
    hourinfo,
    quarterinfo,
    concat(yearinfo,'-',monthinfo,'-',dayinfo,' ',hourinfo) as time_str,
    '-1' as from_url,
    '5' as grouptype,
    '1' as time_type,
    yearinfo, monthinfo, dayinfo
from xiaoma_dwd.visit_consult_dwd 
group by yearinfo, quarterinfo, monthinfo, dayinfo, hourinfo;
```

> 天维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    '-1' as area,
    '-1' as seo_source,
    '-1' as origin_channel,
    '-1' as hourinfo,
    quarterinfo,
    concat(yearinfo,'-',monthinfo,'-',dayinfo) as time_str,
    '-1' as from_url,
    '5' as grouptype,
    '2' as time_type,
    yearinfo, monthinfo, dayinfo
from xiaoma_dwd.visit_consult_dwd
group by yearinfo, quarterinfo, monthinfo, dayinfo;
```

> 月维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    '-1' as area,
    '-1' as seo_source,
    '-1' as origin_channel,
    '-1' as hourinfo,
    quarterinfo,
    concat(yearinfo,'-',monthinfo) as time_str,
    '-1' as from_url,
    '5' as grouptype,
    '3' as time_type,
    yearinfo, monthinfo,
    '-1' as dayinfo
from xiaoma_dwd.visit_consult_dwd
group by yearinfo, quarterinfo, monthinfo;
```

> 季度维度

```
insert into xiaoma_dws.visit_dws partition (yearinfo, monthinfo, dayinfo)
select
    count(distinct sid) as sid_total,
    count(distinct session_id) as session_total,
    count(distinct ip) as ip_total,
    '-1' as area,
    '-1' as seo_source,
    '-1' as origin_channel,
    '-1' as hourinfo,
    quarterinfo,
    concat(yearinfo,'-Q',quarterinfo) as time_str,
    '-1' as from_url,
    '5' as grouptype,
    '4' as time_type,
    yearinfo,
    '-1' as monthinfo,
    '-1' as dayinfo
from xiaoma_dwd.visit_consult_dwd
group by yearinfo, quarterinfo;
```

> 年维度

```
INSERT  INTO TABLE xiaoma_dws.visit_dws PARTITION (yearinfo,monthinfo,dayinfo)
select
   COUNT(DISTINCT wce.sid) as sid_total,
   COUNT(DISTINCT wce.session_id) as sessionid_total,
   COUNT(DISTINCT wce.ip) as ip_total,
   '-1' as  area,
   '-1' as seo_source,
   '-1' as origin_channel,
   '-1' as hourinfo,
   '-1' as quarterinfo,
   wce.yearinfo as time_str,
   '-1' as from_url,
   '5' as groupType,
   '5' as time_type,
   wce.yearinfo as yearinfo,
   '-1' as monthinfo,
   '-1' as dayinfo
from xiaoma_dwd.visit_consult_dwd wce
group by wce.yearinfo;
```

#### 2.2.4 导出数据

##### 2.2.4.1 创建mysql表

```
create database scrm_bi default character set utf8mb4 collate utf8mb4_general_ci;
```

```
CREATE TABLE `xiaoma_visit` (
  sid_total int(11) COMMENT '根据sid去重求count',
  sessionid_total int(11) COMMENT '根据sessionid去重求count',
  ip_total int(11) COMMENT '根据IP去重求count',
  area varchar(32) COMMENT '区域信息',
  seo_source varchar(32) COMMENT '搜索来源',
  origin_channel varchar(32) COMMENT '来源渠道',
  hourinfo varchar(32) COMMENT '小时信息',
  quarterinfo varchar(32) COMMENT '季度',
  time_str varchar(32) COMMENT '时间明细',
  from_url varchar(32) comment '会话来源页面',
  groupType varchar(32) COMMENT '产品属性类型：1.地区；2.搜索来源；3.来源渠道；4.会话来源页面；5.总访问量',
  time_type varchar(32) COMMENT '时间聚合类型：1、按小时聚合；2、按天聚合；3、按月聚合；4、按季度聚合；5、按年聚合；',
  yearinfo varchar(32) COMMENT '年信息',
  monthinfo varchar(32) COMMENT '月信息',
  dayinfo varchar(32) COMMENT '日信息'
);
```

##### 2.2.4.2 执行sqoop导出脚本

```
sqoop export \
--connect "jdbc:mysql://192.168.52.150:3306/scrm_bi?useUnicode=true&characterEncoding=utf-8" \
--username root \
--password '123456' \
--table xiaoma_visit \
--hcatalog-database xiaoma_dws \
--hcatalog-table visit_dws \
-m 100
```

> 执行错误

![image](4B8E8E71AF474F2DB81E9F8065C3ACEE)

> 在hue作业中找到application_1591389362937_0085：

![image](6BEED4047961416995C5C7C2339DFE35)

> 查看具体错误信息：

![image](CFD814CCB01A4CC988204D289CFEBBA4)

![image](D61D5EE8DDDF44D6B1FC1A635118BCFA)

> 原因是from_url字段长度不够，修改后再次执行

```sql
drop table xiaoma_visit;

CREATE TABLE `xiaoma_visit` (
  sid_total int(11) COMMENT '根据sid去重求count',
  sessionid_total int(11) COMMENT '根据sessionid去重求count',
  ip_total int(11) COMMENT '根据IP去重求count',
  area varchar(32) COMMENT '区域信息',
  seo_source varchar(32) COMMENT '搜索来源',
  origin_channel varchar(32) COMMENT '来源渠道',
  hourinfo varchar(32) COMMENT '小时信息',
  quarterinfo varchar(32) COMMENT '季度',
  time_str varchar(32) COMMENT '时间明细',
  from_url varchar(2083) comment '会话来源页面',
  groupType varchar(32) COMMENT '产品属性类型：1.地区；2.搜索来源；3.来源渠道；4.会话来源页面',
  time_type varchar(32) COMMENT '时间聚合类型：1、按小时聚合；2、按天聚合；3、按月聚合；4、按季度聚合；5、按年聚合；',
  yearinfo varchar(32) COMMENT '年信息',
  monthinfo varchar(32) COMMENT '月信息',
  dayinfo varchar(32) COMMENT '日信息'
)ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
```

> 再次执行sqoop脚本，执行成功。

### 2.3 增量流程

#### 2.3.1 数据采集

#### 2.3.2 数据清洗转换

#### 2.3.3 统计分析

#### 2.3.4 导出数据


## 联系博主，加入【羊山丨交流社区】
![联系博主](/img/icon/wechatFindMe.png)