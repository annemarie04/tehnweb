const express = require('express');
const fs = require("fs");
const sharp = require("sharp");
const {Client} = require("pg");
const ejs = require("ejs");
const sass = require("sass");

app = express();

var client = new Client({user: "anne", password: "2017", database: "bd_arason", host: "localhost", port: 5432});
client.connect();




console.log(__dirname)  

app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname+'/static'))
app.use('/temp', express.static(__dirname+'/temp'))


app.get(["/", "/home", "/index"] , function(req,res)  {
    client.query("select * from tabel", function(err, rezQuery){
    console.log(rezQuery);
    res.render('pagini/index', {ip: req.ip, imagini:obImagini.imagini, produse:rezQuery.rows});

    })
    // res.end()
});

app.get("/contactus", function(req,res)  {
    res.render('pagini/contactus')
    res.end()
});


// ----------- curs 4 / Galerie-statica ------------

function creeazaImagini(){
    var buf = fs.readFileSync(__dirname + "/static/json/galerie.json").toString("utf8");
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



//-------------Curs 5 / Galerie-animata -------------

app.get("/galerie-animata", function(req, res) {
    var sirScss = fs.readFileSync(__dirname + "/static/scss/galerie_animata.scss").toString("utf8");
    var culori =["navy", "black", "purple", "gray"];
    var indiceAleator = Math.floor(Math.random()*culori.length);
    var culoareAleatoare= culori[indiceAleator];
    rezScss = ejs.render(sirScss, {culoare: culoareAleatoare});
    console.log(rezScss);
    var caleScss = __dirname + "/temp/galerie-animata.scss";
    fs.writeFileSync(caleScss, rezScss);

    try {
        rezCompilare = sass.compile(caleScss, {sourceMap: true});

        var caleCss = __dirname + "/temp/galerie-animata.css";
        fs.writeFileSync(caleCss, rezCompilare.css);
        res.setHeader("Content-Type", "text/css");
        res.sendFile(caleCss);
    }
   catch(err) {
       console.log(err);
       res.send("Eroare");
   }

});
//------------- end ---------------------------

// ------------ Error / Lab 5 --------------------

function creeazaErori() {
    var buf = fs.readFileSync(__dirname + "/static/json/erori.json").toString("utf8");
    obErori=JSON.parse(buf); //global

    console.log(obErori);
}
creeazaErori();

// randeazaEroare(404,true)
function randeazaErori(res, identificator, status, titlu, text, imagine){
    var eroare = obErori.erori.find(function(elem){ return elem.identificator == identificator});
    if(status){
        res.status(identificator).render("pagini/eroare_generala", {titlu: eroare.titlu, text: eroare.text, imagine: obErori.cale_baza + "/" + eroare.imagine});
    } 
    else{ 
         let titlu = titlu || eroare.titlu;
         let text = text || eroare.text;
         let imagine = imagine || obErori.cale_baza + "/" + eroare.imagine;

        res.render("pagini/eroare_generala", {titlu: titlu, text: text, imagine: imagine});
    }
}
// -------------- end ------------------------------

//------------- Error 404/ Error 403 -----------------

app.get('/*.ejs', function(req, res){
    randeazaErori(res,403,true)

    // res.status(403);
    // res.render('pagini/forbidden');
});

app.get('*', function(req, res){
        randeazaErori(res,404,true)
        // res.status(404);
        // res.render('pagini/error404');
});
//------------- end --------------


app.listen(8080);
console.log("A pornit!");
