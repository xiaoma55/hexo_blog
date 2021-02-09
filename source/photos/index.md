---
title: photos
layout: photo
index_img: /img/articleBg/1(10).jpg
banner_img: /img/articleBg/1(10).jpg
date: 2021-02-08 14:13:16
---

<style>
.ImageGrid {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  text-align: center;
}
.card {
  overflow: hidden;
  transition: .3s ease-in-out;
  border-radius: 8px;
  background-color: #efefef;
  padding: 1.4px;
}
.ImageInCard img {
  padding: 0;
  border-radius: 8px;
  width:100%;
  height:100%;
}
.photo-tab{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: #e1eaf7;
    border-radius: 50%;
    text-align: center;
    cursor: pointer;
    color: #606266;
    font-size: .8rem;
    transition: box-shadow .35s,-webkit-transform .35s;
    transition: transform .35s,box-shadow .35s;
    transition: transform .35s,box-shadow .35s,-webkit-transform .35s;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-right: .8rem;
    margin-top: .8rem;
}
.nav-pills .nav-link.active{
    color: #fff;
    background-color: #d77fcc85;
}
.card{
    border-radius: 10px;
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-clip: border-box; 
    border: none; 
    border-radius: .25rem;
    background: none;
}
@media (prefers-color-scheme: dark) {
  .card {
    background-color: #333;
  }
}
</style>

<div id="imageTab"></div>
<div class="ImageGrid"></div>
