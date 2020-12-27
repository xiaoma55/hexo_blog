var musicArray =new Array(
// "31654478",   //  Victory
//     "31654455",     //  Star Sky
//     "4010892",      //  Real
//     "4010720",      //  Oblivion
    "1447361757",   //  沙悟净（翻自 河图）
        "1293886117",   //  年少有为
        "1499297916",   //  男孩 (Live)
        "482207546",    //  拜无忧（Cover 萧忆情）
        "420008229",    //  殿书

)

document.getElementById("music").innerHTML =
    "<iframe " +
        "frameborder='no' " +
        "border='0' " +
        "marginwidth='0' " +
        "marginheight='0' " +
        "width=330 " +
        "height=86 " +
        "src='//music.163.com/outchain/player?type=2&id=" +
        musicArray[Math.floor(Math.random() * musicArray.length)] +
        "&userid=530079932&auto=1&height=66'>" +
    "</iframe>";
