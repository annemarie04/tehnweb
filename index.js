const express = require('express');
const fs = require("fs");
const sharp = require("sharp");
// const (Client)=require("PG");

app = express();

// client = new Client((user:"anne", password:"2017", database:"db_test", host:"localhost", port: 5432));



console.log(__dirname)  

app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname+'/static'))


app.get(["/", "/home", "/index"] , function(req,res)  {
    res.render('pagini/index', {ip: req.ip, imagini:obImagini.imagini});
    res.end()
});

app.get("/contactus", function(req,res)  {
    res.render('pagini/contactus')
    res.end()
});

app.get('/*.ejs', function(req, res){
    res.status(403);
    res.render('pagini/forbidden');
});

app.get('*', function(req, res){
        res.status(404);
        res.render('pagini/error404');
});

// ----------- curs 4 ------------

function creeazaImagini(){
    var buf=fs.readFileSync(__dirname+"/static/json/galerie.json").toString("utf8");
    console.log(buf);
    obImagini = JSON.parse(buf); //global

    for (let imag of obImagini.imagini){
        let nume_imag, extensie;
        [nume_imag, extensie ] = imag.fisier.split(".")// "abc.de".split(".") ---> ["abc","de"] // imagine.png --> imagine.webp
        let dim_mic = 150
        
        imag.mic =`${obImagini.cale_galerie}/mic/${nume_imag}-${dim_mic}.webp` //nume-150.webp // "a10" b=10 "a"+b `a${b}`
        //console.log(imag.mic);

        let dim_mediu = 300

        imag.mare = `${obImagini.cale_galerie}/${imag.fisier}`;
        if (!fs.existsSync(imag.mic))
        sharp(__dirname + "/" + imag.mare).resize(dim_mic).toFile(__dirname + "/" + imag.mic);
       
        imag.mediu =`${obImagini.cale_galerie}/mediu/${nume_imag}-${dim_mediu}.png`
        if (!fs.existsSync(imag.mediu))
            sharp(__dirname + "/" + imag.mare).resize(dim_mediu).toFile(__dirname + "/" + imag.mediu);


    }
    console.log(obImagini);

}
creeazaImagini();

//------------- end --------------

app.listen(8080);
console.log("A pornit!");
