const musicArray =new Array(
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

const myMusic = document.getElementById("music");

myMusic.innerHTML =
            "<source src='http://music.163.com/song/media/outer/url?id=" +
             musicArray[Math.floor(Math.random() * musicArray.length)] +
            "&userid=530079932' type='audio/mpeg' />";

function play(){
    myMusic.muted = true;
    myMusic.play();
    myMusic.muted = false;
    myMusic.play();
}

play();
