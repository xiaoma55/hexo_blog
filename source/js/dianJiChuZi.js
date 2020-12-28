// 点击出字bynote.cn
var a_idx = 0;
jQuery(document).ready(function($) {
    $("body").click(function(e) {
        var a = new Array
        ("黑白", "圣堂", "血天使", "天剑","鬼刀", "阿修罗", "捡起你的头颅","为我而战吧","天堂之眼","羽族","天使","亚当之战","冰公主","海琴烟","奥斯丁","银白骑士","卡因","魁七","冰蓝吊坠","燃焰玫瑰"
            ,"云娜","北王","洪都","水光之城","水光蝶","小绿","天南之剑","剑指南天","翻掌弑神","覆掌诛仙","风铃","西凌斯","凌雪");
        var $i = $("<span/>").text(a[a_idx]);
        a_idx = (a_idx + 1) % a.length;
        var x = e.pageX,
        y = e.pageY;
        $i.css({
            "z-index": 5,
            "top": y - 20,
            "left": x,
            "position": "absolute",
            "font-weight": "bold",
           "color": "rgb(" + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + ")"
        });
        $("body").append($i);
        $i.animate({
            "top": y - 180,
            "opacity": 0
        },
      3000,
      function() {
          $i.remove();
      });
    });
    setTimeout('delay()', 2000);
});

function delay() {
    $(".buryit").removeAttr("onclick");
}