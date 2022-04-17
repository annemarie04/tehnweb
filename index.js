const express = require('express');
const fs = require("fs");
const sharp = require("sharp");
const {Client} = require("pg");
const ejs = require("ejs");
const sass = require("sass");
const crypto = require('crypto');
const formidable = require('formidable');
const session = require('express-session');


app = express();

// var client = new Client({user: "anne", password: "2017", database: "bd_arason", host: "localhost", port: 5432});
// client.connect();
var client = new Client({
    user: "tjcmnycknpyunl", 
    password: "3392e4ada4df84e796d35dd2e1d32f336102441bacffd34d2eeb73ca44f43068",
    database: "d1i1rtikn13hb",
    host: "ec2-52-86-56-90.compute-1.amazonaws.com",
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});
client.connect();

const obGlobal={obImagini:null, obErori:null};


// console.log(__dirname)  

app.set('view engine', 'ejs');

app.use('/static', express.static(__dirname+'/static'))
// app.use("/*", function(req,res, next){
//     res.locals.propGenerala = "Ceva care se afiseaza pe toate pag";
// })

app.use('/temp', express.static(__dirname+'/temp'))



//---------------------Utilizatori / Curs 8 -------------------------

parolaServer = "tehniciweb";
app.post("/inreg", function(req,res){
    var formular = new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier){
        var parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString('hex');
        var comandaInserare=`insert into utilizatori (username, nume, prenume, parola, email, culoare_chat) values ('${campuriText.username}','${campuriText.nume}', '${campuriText.prenume}', '${parolaCriptata}', '${campuriText.email}', '${campuriText.culoare_chat}' ) `;
        client.query(comandaInserare, function(err, rezInserare) {
            if(err)
                console.log(err)
        })
        res.send('OK')
    });
});

app.get("/inregistrare", function(req,res)  {
    res.render('pagini/inregistrare')
    res.end()
});
//---------------------------The End------------------------------------



app.get(["/", "/home", "/index"] , function(req,res)  {
    client.query("select * from tabel", function(err, rezQuery){
    // console.log(rezQuery);
    numbers=[7,8,9,11];
    //alegem un numar random din array-ul de numere de mai sus
    numar_imagini=numbers[Math.floor(Math.random()*numbers.length)];
    console.log(numar_imagini);
    //generam un array de numere random, de lungimea numarului random ales mai sus
    var arr = [];
    while(arr.length < numar_imagini){
        var r = Math.floor(Math.random() * 13) + 1;
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    console.log(arr);
    
    //construim un array cu poze random din json
    imagini = []
    for (let i = 0; i < arr.length; i++) {
        imagini.push(obImagini.imagini[arr[i]]);
    }
    // console.log(imagini[1])
    compileSass(numar_imagini);
    res.render('pagini/index', {ip: req.ip, imagini:obImagini.imagini, imagini_random:imagini, produse:rezQuery.rows});

    })
    // res.end()
});

function compileSass(numar_imagini){
    var sirScss = fs.readFileSync(__dirname + "/static/scss/galerie_animata.scss").toString("utf8");
    var culori =["navy", "black", "purple", "gray"];
    var indiceAleator = Math.floor(Math.random()*culori.length);
    var culoareAleatoare= culori[indiceAleator];
    rezScss = ejs.render(sirScss, {culoare: culoareAleatoare, numar_imagini: numar_imagini});
    // console.log(rezScss);
    var caleScss = __dirname + "/temp/galerie-animata.scss";
    fs.writeFileSync(caleScss, rezScss);

    try {
        rezCompilare = sass.compile(caleScss, {sourceMap: true});

        var caleCss = __dirname + "/temp/galerie-animata.css";
        fs.writeFileSync(caleCss, rezCompilare.css);
    }
   catch(err) {
    //    console.log(err);

   }
}

// ------------- Pagina Produse / Curs 6 ---------------

app.get("/products", function(req, res) {
    client.query("select * from unnest(enum_range(null::categ_colectie))", function(err, rezCateg){
    

        var cond_where=req.query.tip ? ` tip_produs='${req.query.tip}'` : " 1=1";
    

        client.query("select * from articole where "+cond_where, function(err, rezQuery){
        // console.log(rezQuery);
        res.render('pagini/products', {produse:rezQuery.rows, optiuni:rezCateg.rows});
        });
    });
});

app.get("/product/:id", function(req, res) {

    client.query(`select * from articole where id= ${req.params.id}`, function(err, rezQuery){
        // console.log("------------------------------------------")
        // console.log(rezQuery);
        res.render('pagini/product', {prod:rezQuery.rows[0]});
        });
});

// --------------------- End ----------------------


app.get("/contactus", function(req,res)  {
    res.render('pagini/contactus')
    res.end()
});
app.get("/newapparel", function(req,res)  {
    res.render('pagini/newapparel', {imagini:obImagini.imagini})
    res.end()
});


// ----------- curs 4 / Galerie-statica ------------

function creeazaImagini(){
    var buf = fs.readFileSync(__dirname + "/static/json/galerie.json").toString("utf8");
    // console.log(buf);
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
    // console.log(obImagini);

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
    // console.log(rezScss);
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
    //    console.log(err);
       res.send("Eroare");
   }

});
//------------- end ---------------------------

// ------------ Error / Lab 5 --------------------

function creeazaErori() {
    var buf = fs.readFileSync(__dirname + "/static/json/erori.json").toString("utf8");
    obErori=JSON.parse(buf); //global

    // console.log(obErori);
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

// // ------------- Lab 6 -------------
// window.onload=function(){
//     var p = document.getElementById("p1");
//     p.title = "o descriere";
//     p.innerHTML = "Un paragraf si mai <b>frumos</b>";
//     p.style.border = "1px solid blue";
//     p.style.background = "black";
//     var buton = document.getElementById("btn");

//     button.onclick = function() {
//         var inp = document.getElementById("inp");
//         p.innerHTML += " "+inp.value;
//     }



// }
// var bfiltru=document.getElementById("filtreaza");
// bflitru.onclick = function() {
//     var val_inp = document.getElementById("inp").value;
//     var paragrafe = document.getElementByClassName("a");
//     for(let p of paragrafe) {
//         p.style.display = "none";
//         if(p.innerHTML.includes(val_inp)) {
//             p.style.display = "block";
//         }
//     }
// }
// // var buton_document.getElementById("btn");
// alert(button.innerHTML);
// // --------------------- End ----------------------

var s_port = process.env.PORT || 8080;
app.listen(s_port);
console.log("A pornit!");
