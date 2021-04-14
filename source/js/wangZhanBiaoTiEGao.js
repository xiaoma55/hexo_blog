var OriginTitle = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        $('[rel="icon"]').attr('href', "../img/icon/favicon.ico");
        document.title = '不要小宝贝啦ヽ(●-`Д´-)ノ！';
        clearTimeout(titleTime);
    }
    else {
        $('[rel="icon"]').attr('href', "../img/icon/favicon.png");
        document.title = '你回来宝宝就开心ヾ(Ő∀Ő3)ノ！' + OriginTitle;
        titleTime = setTimeout(function () {
            document.title = OriginTitle;
        }, 2000);
    }
});
