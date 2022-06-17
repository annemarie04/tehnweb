const express = require('express');
const fs = require("fs");
const sharp = require("sharp");
const {Client} = require("pg");
const ejs = require("ejs");
const sass = require("sass");
const crypto = require('crypto');
const formidable = require('formidable');
const session = require('express-session');
const nodemailer = require('nodemailer');
const helmet = require('helmet');

app = express();
// app.use(helmet.frameguard()); // nu se deschide siteul in iframe

app.use(session({ //aici se creeaza proprietatea session a requestului (pot folosi req.session)
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune

    resave: true,

    saveUninitialized: false

  }));
// console.log(__dirname)  

app.set('view engine', 'ejs');

app.use('/static', express.static(__dirname+'/static'))
app.use('/poze_uploadate', express.static(__dirname+'/poze_uploadate'));

// app.use("/*", function(req,res, next){
//     res.locals.propGenerala = "Ceva care se afiseaza pe toate pag";
// })


//OBIECTE GLOBALE
const obGlobal={
    obImagini: null, 
    obErori: null, 
    emailServer: "arason2002@gmail.com",
    portAplicatie: 8080,
    sirAlphaNum: "",
    protocol: null,
    numeDomeniu: null
};
foldere=["temp", "poze_uploadate"];
for(let folder of foldere){
    var path = require('path');
    let calefolder = path.join(__dirname, folder);
    if (!fs.existsSync(calefolder))
    fs.mkdirSync(calefolder);
}

app.use('/temp', express.static(__dirname+'/temp'))
// client connect
if(process.env.SITE_ONLINE){
    obGlobal.protocol = "https://";
    obGlobal.numeDomeniu = "blooming-harbor-76274.herokuapp.com";
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
}
else{
    // var client = new Client({
    //     user: "anne", 
    //     password: "2017", 
    //     database: "bd_arason", 
    //     host: "localhost", 
    //     port: 5432});
    obGlobal.protocol = "http://";
    obGlobal.numeDomeniu = "localhost:" + obGlobal.portAplicatie;

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
}
client.connect();
//---------------------END CLIENT CONNECT-----------------------




// ----------------MAIL-----------------------

async function trimiteMail(email, subiect, mesajText, mesajHtml, atasamente=[]){
        var transp= nodemailer.createTransport({        
        service: "gmail",
        secure: false,        
        auth:{//date login             
            user: obGlobal.emailServer,            
            pass: "vahdkmeazczibxhy"        
        },        
        tls:{            
            rejectUnauthorized: false        
        }    
    });    
    //genereaza html   
     await transp.sendMail({        
         from: obGlobal.emailServer,        
         to: email,        
         subject: subiect,//"Te-ai inregistrat cu succes",        
         text: mesajText, //"Username-ul tau este "+username        
         html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,        
         attachments: atasamente    
        })    
         console.log("trimis mail");}

//---------------------------END MAIL----------------------



app.use('/*', function(req, res, next){
    res.locals.propGenerala= "ceva care se afiseaza pe toate paginile";
    res.locals.utilizator = req.session.utilizator;
    res.locals.mesajLogin = req.session.mesajLogin;
    req.session.mesajLogin = null;

    // try {
    //     res.locals.mesajLogin.session = req.session.mesajLogin
    // }
    // catch {
    // }
    // req.session.mesajLogin = null;
    next();
});

app.get("/*", function(req, res, next){
    let id_utiliz = req.session.utilizator ? req.session.utilizator.id : null;
    var queryInsert = `insert into accesari (ip, user_id, pagina) values('${getIp(req)}', ${id_utiliz}, '${req.url}')`;
    client.query(queryInsert, function(err, rezQuery){
        if(err) {
            console.log("---", err)
        }
    });
    next();
});

var ipuri_active={};

// app.all("/*", function(req, res, next){
//     let ipReq = getIp(req);
//     let ipt_gasit = ipuri_active[ipReq+"|"+req.url];
//     timp_curent = new Date(); 
// }) /// NOT DONE
// app.get(["/", "/index", "/home","/login"], function(req, res){
 
 
//     querySelect="select username, nume from utilizatori where id in (select distinct user_id from accesari where now()-data_accesare <= interval '5 minutes')"
//     client.query(querySelect, function(err, rezQuery){
//         useriOnline=[]
//         if(err) console.log(err);
//         else useriOnline= rezQuery.rows;
//         res.render("pagini/index", {ip:getIp(req), imagini:obGlobal.obImagini.imagini, useriOnline: useriOnline});
//     });
   
// });
/// TODO: stergere accesari vechi
// unction stergeAccesariVechi(){
//     var queryDelete="delete from accesari where now()-data_accesare >= interval '10 minutes' ";
//     client.query(queryDelete, function(err, rezQuery){
//         console.log(err);
//     });
// }
 
// stergeAccesariVechi();
// setInterval(stergeAccesariVechi, 10*60*1000)

//---------------------Utilizatori: Inregistrare Curs 8-10 -------------------------

intervaleAscii = [[48,57],[65,90], [97-122]] // 0-9, a-z, A-Z
obGlobal.sirAlphaNum = ""

for(let interval of intervaleAscii) {
    for (let i = interval[0]; i <= interval[1]; i ++){
        obGlobal.sirAlphaNum += String.fromCharCode(i);
    }
}

function genereazaToken(n){
    let token = ""
    for(let i = 0; i < n; i ++){
        token += obGlobal.sirAlphaNum[Math.floor(Math.random() * obGlobal.sirAlphaNum.length)]
    }
    return token;

}
// request ip
function getIp(req){ //pentru Heroku
    var ip = req.headers["x-forwarded-for"]; //ip-ul userului pentru care este forwardat mesajul
    if (ip){
        let vect=ip.split(",");
        return vect[vect.length-1];
    }
    else if (req.ip){
        return req.ip;
    }
    else{
     return req.connection.remoteAddress;
    }
}





parolaServer = "tehniciweb";
app.post("/inreg", function(req,res){

    var user;
    var formular = new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier){

        var eroare="";
        if(campuriText.username == ""){
            eroare += "Username necompletat. ";
        }

        if(!campuriText.username.match(new RegExp("[A-Za-z0-9]+$"))){
            eroare += "Username nu corespunde patternului. ";
        }

        if(!eroare) {
            queryUtiliz = `select username from utilizatori where username= '${campuriText.username}'`;
            client.query(queryUtiliz, function(err, rezUtiliz){
                if(rezUtiliz.rows.length != 0){
                    eroare += "Username-ul mai exista. ";
                    res.render("pagini/inregistrare", {err: "Eroare: " + eroare});
                }
                else{
                    var parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString('hex');
                    var token = genereazaToken(100);
                    var comandaInserare=`insert into utilizatori (username, nume, prenume, parola, email, culoare_chat, cod) values ('${campuriText.username}','${campuriText.nume}', '${campuriText.prenume}', '${parolaCriptata}', '${campuriText.email}', '${campuriText.culoare_chat}', '${token}) `;
                
                    client.query(comandaInserare, function(err, rezInserare) {
                        if(err){
                            console.log(err)
                            res.render("pagini/inregistrare", {err: "Eroare baza de date"});
                        }
                        else {
                            res.render("pagini/inregistrare", {raspuns: "Datele au fost introduse"});
                            //http://localhost:8080/cod/username/codul_in_sine_de_100_chr_aleatoare
                            let linkConfirmare = `${obGlobal.protocol}${obGlobal.numeDomeniu}/cod/${campuriText.username}/${token}`
                            trimiteMail(campuriText.email, "Te-ai inregsitrat", "text", `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${campuriText.username}.</p><p> Link Confirmare: <a href = ${linkConfirmare}> ${linkConfirmare}</a></p>`);
                        }
                    }) // end client.query inserare
                } // end else
            }) // end client.query queryUtiliz
        } // end if eroare
        else {
            res.render("pagini/inregistrare", {err: "Eroare :" + eroare});
        }// end else
    })

    formular.on("field", function(nume,val){
        console.log(`--- ${nume} = ${val}`);  // 1
        if(nume == "username")
        username = val;
    })
    formular.on("fileBegin", function(nume,fisier){ //2
    //    caleUtiliz = path.join(_dirname, "poze_uploadate", username)
    //    if(!fs.existsSync(caleUtiliz))
    //         fs.mkdirSync(caleUtiliz);
    //     fisier.filepath = path.join(caleUtiliz, fisier.originalFilename)
       console.log(nume, fisier);
    //    console.log(nume, fisier.filepath);
    })    
    // formular.on("file", function(nume,fisier){//3
 
    // });

});

app.get("/cod/:username/:token", function(req, res){
    var comandaUpdate = `update utilizatori set confirmat_mail = true where username = '${req.params.username}' and cod = '${reg.params.token}`;
    client.query(comandaUpdate, function(err, rezUpdate){
        if(err){
            console.log(err)
        }
        else{
            if(rezUpdate.rows.length == 1)
            res.render("pagini/confimare");
        }

    })
})


app.get("/inregistrare", function(req,res)  {
    res.render('pagini/inregistrare');
    res.end()
});
//--------------------- END INREGISTRARE -------------------------


//---------------------------- USERI -------------------------------

app.get("/useri", function(req, res) {
    if(req.session.utilizator && req.session.utilizator.rol == "admin") {
        client.query("select * from utilizatori", function(err, rezQuery){
            console.log(err)
            // console.log(rezQuery)
            res.render("pagini/useri", {useri: rezQuery.rows});
        
        });
    } else {
        randeazaErori(res, 403, true);
    }
});

app.post("/sterge_utiliz", function(req, res){
    if(req.session.utilizator && req.session.utilizator.rol == "admin"){
        var formular = new formidable.IncomingForm()
        formular.parse(req, function(err, campuriText, campuriFisier){
            // var ceva = `delete from utilizatori where id = '${campuriText.id_utiliz}'`
            // console.log(ceva)
            client.query(`delete from utilizatori where id = '${campuriText.id_utiliz}'`, function(err, rezQuery){
            console.log(err)
            /// TODO: tratat erori sau mesaj "a sters sau nu utilizatorul"
            // console.log(rezQuery)
            res.redirect("/useri");
            });
        });
    }
})

//---------------------Utilizatori: Logare Curs 10 -------------------------

app.post("/login", function(req,res){

    var formular = new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier){
        var parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString('hex');
        // var querySelect = `select * from utilizatori where username = '${campuriText.username}' and parola = '${parolaCriptata}' and confirmat_mail = true `;
        var querySelect = `select * from utilizatori where username = $1::text and parola = $2::text and confirmat_mail = true `;

        client.query(querySelect,[campuriText.username, parolaCriptata], function(err, rezSelect){
            if(err){
                console.log(err);
                // randeazaEroare(res, 2);
            }
            else{
                console.log(rezSelect)
                if(rezSelect.rows.length == 1){ //Daca am utilizatorul si credentialele sunt corecte
                    req.session.utilizator={
                        id: rezSelect.rows[0].id,
                        nume: rezSelect.rows[0].nume,
                        prenume: rezSelect.rows[0].prenume,
                        username: rezSelect.rows[0].username,
                        email: rezSelect.rows[0].email,
                        culoare_chat: rezSelect.rows[0].culoare_chat,
                        rol: rezSelect.rows[0].rol
                    }
                    res.locals.utilizator=req.session.utilizator
                    req.session.mesajLogin="Login reusit."
                    res.redirect("/index");
                }
                else {
                    req.session.mesajLogin="Login esuat."
                    res.redirect("/index");
                }
            }
        })
    })
});
//TODO: parametrizat query de la utilizatori
//logout
app.get("/logout", function(req,res){
    req.session.destroy();
    res.locals.utilizator=null;
    res.render("pagini/logout");
});
//--------------------------- END LOGARE ------------------------------------

// -------------------------------- UPDATE PROFIL -------------------------------------------
app.get("/profil", function(req,res)  {
    res.render('pagini/profil');
    res.end()
});

app.post("/profil", function(req, res){
    console.log("profil");
    if (!req.session.utilizator){
        res.render("pagini/eroare_generala",{text:"Nu sunteti logat."});
        return;
    }
    var formular= new formidable.IncomingForm();
 
    formular.parse(req,function(err, campuriText, campuriFile){
       
        var criptareParola=crypto.scryptSync(campuriText.parola, parolaServer, 64).toString('hex');
 
        //TO DO query
        var queryUpdate=`update utilizatori set nume='${campuriText.nume}', prenume='${campuriText.prenume}', email='${campuriText.email}', culoare_chat = '${campuriText.culoare_chat}' where parola ='${criptareParola}`;
        console.log(queryUpdate)
        client.query(queryUpdate,  function(err, rez){
            if(err){
                console.log(err);
                res.render("pagini/eroare_generala",{text:"Eroare baza date. Incercati mai tarziu."});
                return;
            }
            console.log(rez.rowCount);
            if (rez.rowCount==0){
                res.render("pagini/profil",{mesaj:"Update-ul nu s-a realizat. Verificati parola introdusa."});
                return;
            }
            else{
                //actualizare sesiune
                req.session.utilizator.nume = campuriText.nume;
                req.session.utilizator.prenume = campuriText.prenume;
                req.session.utilizator.email = campuriText.email;
                req.session.utilizator.culoare_chat = campuriText.culoare_chat;
            }
            res.render("pagini/profil",{mesaj:"Update-ul s-a realizat cu succes."});
 
        });
       
 
    });
});




//--------------------------- END UPDATE PROFIL ------------------------------------


app.get(["/", "/home", "/index"] , function(req,res)  {
    client.query("select * from tabel", function(err, rezQuery){
    // console.log(rezQuery);
    numbers=[7,8,9,11];
    //alegem un numar random din array-ul de numere de mai sus
    numar_imagini=numbers[Math.floor(Math.random()*numbers.length)];
    // console.log(numar_imagini);
    //generam un array de numere random, de lungimea numarului random ales mai sus
    var arr = [];
    while(arr.length < numar_imagini){
        var r = Math.floor(Math.random() * 13) + 1;
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    // console.log(arr);
    
    //construim un array cu poze random din json
    imagini = []
    for (let i = 0; i < arr.length; i++) {
        imagini.push(obImagini.imagini[arr[i]]);
    }
    // console.log(imagini[1])
    compileSass(numar_imagini);
    res.render('pagini/index', {ip: getIp(req), imagini:obImagini.imagini, imagini_random:imagini, produse:rezQuery.rows});

    })
    // res.end()
});






// ----------------- Compilare SASS - Galerie animata -------------------------
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
            client.query("select DISTINCT culoare from articole ORDER BY culoare ASC ", function(err, rezCuloare){
                client.query("select DISTINCT an_colectie from articole ORDER BY an_colectie ASC ", function(err, rezAn){
                    client.query("select * from unnest(enum_range(null::tipuri_produse))", function(err, rezTip){
                        res.render('pagini/products', {produse:rezQuery.rows, optiuni:rezCateg.rows, tipuri:rezTip.rows, ani:rezAn.rows, culori:rezCuloare.rows});
                    });
                });
            });
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
app.get('*', function(req, res, next){
    randeazaErori(res, 404, true);
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

var s_port = process.env.PORT || obGlobal.portAplicatie;
app.listen(s_port);
console.log("A pornit!");
