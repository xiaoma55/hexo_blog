//运行时间bynote.cn
var now = new Date(); 
function createtime() { 
    var grt= new Date("11/15/2019 00:00:00");//在此处修改你的建站时间，格式：月/日/年 时:分:秒
    now.setTime(now.getTime()+250); 
    days = (now - grt ) / 1000 / 60 / 60 / 24; dnum = Math.floor(days); 
    hours = (now - grt ) / 1000 / 60 / 60 - (24 * dnum); hnum = Math.floor(hours); 
    if(String(hnum).length ==1 ){hnum = "0" + hnum;} minutes = (now - grt ) / 1000 /60 - (24 * 60 * dnum) - (60 * hnum); 
    mnum = Math.floor(minutes); if(String(mnum).length ==1 ){mnum = "0" + mnum;} 
    seconds = (now - grt ) / 1000 - (24 * 60 * 60 * dnum) - (60 * 60 * hnum) - (60 * mnum); 
    snum = Math.round(seconds); if(String(snum).length ==1 ){snum = "0" + snum;} 
    document.getElementById("timeDate").innerHTML = "本站安全运行&nbsp"+dnum+"&nbsp天 ";
    document.getElementById("times").innerHTML = hnum + "&nbsp小时 " + mnum + "&nbsp分 " + snum + "&nbsp秒";
} 
setInterval("createtime()",250);