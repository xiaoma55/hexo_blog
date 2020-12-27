var musicArray =new Array(
"31654478",   //  Victory
    "31654455",     //  Star Sky
    "4010892",      //  Real
    "4010720",      //  Oblivion
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
