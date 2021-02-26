---
title: 大数据_Hive索引
index_img: /img/articleBg/1(50).jpg
banner_img: /img/articleBg/1(50).jpg
tags:
  - 标签一
  - 标签一
category:
  - - 一级分类
    - 二级分类
  - - 一级分类
    - 二级分类
  - - 一级分类
 
date: 2021-01-12 11:10:58
---

写摘要，就是首页显示的那个

<!-- more -->

## Hive文档
```
https://cwiki.apache.org/confluence/display/Hive/Home#Home-UserDocumentation
```

## 创建删除表

```
https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL#LanguageManualDDL-CreateTableCreate/Drop/TruncateTable
```

```
CREATE [TEMPORARY] [EXTERNAL] TABLE [IF NOT EXISTS] [db_name.]table_name    -- (Note: TEMPORARY available in Hive 0.14.0 and later)
  [(col_name data_type [column_constraint_specification] [COMMENT col_comment], ... [constraint_specification])]
  [COMMENT table_comment]
  [PARTITIONED BY (col_name data_type [COMMENT col_comment], ...)]
  [CLUSTERED BY (col_name, col_name, ...) [SORTED BY (col_name [ASC|DESC], ...)] INTO num_buckets BUCKETS]
  [SKEWED BY (col_name, col_name, ...)                  -- (Note: Available in Hive 0.10.0 and later)]
     ON ((col_value, col_value, ...), (col_value, col_value, ...), ...)
     [STORED AS DIRECTORIES]
  [
   [ROW FORMAT row_format] 
   [STORED AS file_format]
     | STORED BY 'storage.handler.class.name' [WITH SERDEPROPERTIES (...)]  -- (Note: Available in Hive 0.6.0 and later)
  ]
  [LOCATION hdfs_path]
  [TBLPROPERTIES (property_name=property_value, ...)]   -- (Note: Available in Hive 0.6.0 and later)
  [AS select_statement];   -- (Note: Available in Hive 0.5.0 and later; not supported for external tables)
  
CREATE [TEMPORARY] [EXTERNAL] TABLE [IF NOT EXISTS] [db_name.]table_name
  LIKE existing_table_or_view_name
  [LOCATION hdfs_path];
```


```
# 设置ORC压缩格式前一定要先设置hive.exec.orc.compression.strategy
set hive.exec.orc.compression.strategy=COMPRESSION;

drop table itcast_dimen.class_studying_student_count_dimen;

create table if not exists itcast_dimen.class_studying_student_count_dimen(

    id int,
    school_id  int comment "校区id",
    subject_id int comment "学科id",
    class_id int comment "班级id",
    studying_student_count int comment "在读班级人数",
    studying_date string comment "在读日期"
)
comment "在读班级的每天在读学员数"
partitioned by (dt string)                                  # 如果添加了此关键字，表示当前是个分区表 分区键、类型
row format delimited fields terminated by '\t'              # row format表示字段与字段之间的分隔符
stored as orc                                               # 当前存储的格式 比如 TextFile orc parquet。hive中，表的默认存储格式为TextFile
tblproperties                                               # 指定一些参数，如压缩格式，索引等
('orc.compress'='SNAPPY',                                   # 压缩格式
'orc.filter.columns'='studying_student_count,studying_date' # filter.columns索引列
)
;
```


## 联系博主，加入【羊山丨交流社区】
![联系博主](/img/icon/wechatFindMe.png)