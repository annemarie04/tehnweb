window.addEventListener("load", function(){
    // bara de pret
    document.getElementById("inp-pret1").onchange = function(){
        document.getElementById("infoRange1").innerHTML = " (" + this.value + ") ";
    }
    document.getElementById("inp-pret2").onchange = function(){
        document.getElementById("infoRange2").innerHTML = " (" + this.value + ") ";
    }




    // buton filtrare
    document.getElementById("filtrare").onclick = function(){
        // daca returneaza false inseamna ca nu avem erori
        if(verificare_eroare()){
            return
        }

        //display none la erori
        document.getElementById("eroare-nume").style.display = 'none';






        console.log("aaaa")
        var valNume = document.getElementById("inp-nume").value.toLowerCase();
        // butonare Radio / filtru marimi
        var butoaneRadio = document.getElementsByName("gr_rad");
        for(let rad of butoaneRadio){
            if(rad.checked){
                var valMarime = rad.value;
                break;
            }
        }
        var minMarime, maxMarime;
        if (valMarime != "toate"){
            [minMarime, maxMarime] = valMarime.split(":");
            minMarime = parseInt(minMarime);
            maxMarime = parseInt(maxMarime);
        }
        else{
            minMarime = 0;
            maxMarime = 10000000000;
        }


        var valPretMin = document.getElementById("inp-pret1").value;
        var valPretMax = document.getElementById("inp-pret2").value;


        var valCategorie = document.getElementById("inp-categorie").value;
        var articole = document.getElementsByClassName("produs");
        var valAn = document.getElementById("inp-an_colectie").value;
        var valAvailable = document.getElementById("soldout0").checked;
        var valSoldOut = document.getElementById("soldout1").checked;
        var valDescriere = document.getElementById("textarea").value.toLowerCase();
        var valCuloare = document.getElementById("inp-culoare");

        // array valCuloare
        var arrayCulori = [];
        var options = valCuloare && valCuloare.options;
        var opt;

        for (var i=0, iLen=options.length; i<iLen; i++) {
            opt = options[i];
            if (opt.selected) {
                arrayCulori.push(opt.value);
            }
        }
        // var arrayAni = [];
        // var options = valAn && valAn.options;
        // var opt;

        // for (var i=0, iLen=options.length; i<iLen; i++) {
        //     opt = options[i];
        //     if (opt.selected) {
        //         arrayAni.push(opt.value);
        //     }
        // }
        console.log(arrayAni);

        // parcurgere articole si filtrare
        for(let art of articole){
            art.style.display = "none";

            // filtrare nume
            let numeArt = art.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            let cond1 = true;
            // regex
            let regex = new RegExp('([*])');
            if(valNume && regex.test(valNume)){
                let temp = valNume.split('*')[0] + '.*' + valNume.split('*')[1];
                cond1 = (numeArt.match(`${temp}`));
                
            }
            else if(valNume) {
                cond1 = (numeArt.includes(valNume));
            }

            // filtrare marime
            let marimeArt =  parseInt(art.getElementsByClassName("val-marime")[0].innerHTML);
            let cond2 = (minMarime <= marimeArt && maxMarime >= marimeArt)

            // filtrare pret
            let pretArt =  parseInt(art.getElementsByClassName("val-pret")[0].innerHTML);
            let cond3 = (valPretMin <=pretArt && valPretMax >= pretArt);

            // filtare categorie colectie
            let categorieArt = art.getElementsByClassName("val-categorie")[0].innerHTML;
            let cond4 = (valCategorie == "toate") || (categorieArt == valCategorie);

            //filtrare an
            let anArt = art.getElementsByClassName("val-an_colectie")[0].innerHTML;
            let cond5 = (valAn == "toate")|| (valAn == anArt)

            //filtrare soldout
            let stocArt = art.getElementsByClassName("val-disponibil")[0].innerHTML.replace(/\s/g, '');
            if(valSoldOut == 1 && valAvailable == 1)
            {
                cond6 = true;
            }
            else if(valSoldOut && (valAvailable == 0))
            {
                cond6 = (stocArt === 'false');
            }
            else if(valSoldOut == 0 && (valAvailable == 1))
            {
                cond6 = (stocArt === 'true');
            }

            //filtrare descriere
            let descArt = art.getElementsByClassName("val-descriere")[0].innerHTML;
            let cond7 = descArt.includes(valDescriere);

            //filtrare culoare
            let culArt = art.getElementsByClassName("val-culoare")[0].innerHTML;
            let cond8 = false;

            if(arrayCulori.includes('toate'))
            {
                cond8 = true;
            }
            else 
            {
                cond8 = arrayCulori.includes(culArt);

            }

            // filtrare finala
            let conditieFinala = cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8;

                if(conditieFinala)
                    art.style.display = "block";

            
        }
    }


    function verificare_eroare(){
        let eroare = false;

        var valNume = document.getElementById("inp-nume").value.toLowerCase();
        let regexNume = new RegExp("^[a-z\s.,*]+$");
        if(valNume && !regexNume.test(valNume)) {
            document.getElementById("eroare-nume").style.display = 'block';
            eroare= true;
        }
        
        // get datalist
        let anColectie = document.getElementById("inp-an_colectie")
        console.log(anColectie);
        
        // array de values in an colectie
        // trb sa verificam ca value introdus este inclus in [toate, 2019, 2020, 2021, 2022] 
        // [toate, 2019, 2020, 2021, 2022] .includes(ancolectie.value)
        // daca vedem ca nu este, eroare ia valoarea true si dam display block la un mesaj de eroare pe care 
        // va trebui sa-l creezi in html
        // nu uita de resetare la display none
        if(anColectie.value){

        }


     return eroare;
    }


    // resetare filtre
    document.getElementById("resetare").onclick = function(){
        var articole = document.getElementsByClassName("produs");
        for(let art of articole){
            art.style.display = "block";
        }
        document.getElementById("inp-nume").value = "";
        document.getElementById("i_rad4").checked = true;
        document.getElementById("sel-toate").selected = true;
        document.getElementById("inp-pret1").value = 0;
        document.getElementById("inp-pret2").value = 16;
        document.getElementById("infoRange1").innerHTML = " (0) ";
        document.getElementById("infoRange2").innerHTML = " (0) ";
        document.getElementById("sel-toate2").selected = true;
        document.getElementById("soldout0").checked = true;
        document.getElementById("soldout1").checked = true;
        document.getElementById("textarea").value = "";
        document.getElementById("textarea").placeholder = "Descrieti aici articolul cautat...";
        
        // resetare select multiplu
        var valCuloare = document.getElementById("inp-culoare");
        var options = valCuloare && valCuloare.options;
        var opt;
        for (var i=0, iLen=options.length; i<iLen; i++) {
            opt = options[i];
            if (opt.selected) {
                opt.selected = false;
            }
        }
        document.getElementById("sel-toate-culoare").selected = true;

    }



    
    //functie sortare
    function sorteaza(semn){    
        var articole=document.getElementsByClassName("produs");        
        var v_articole= Array.from(articole)      
          
        v_articole.sort(function(a,b){            
            let nume_a=a.getElementsByClassName("val-nume")[0].innerHTML                
            let nume_b=b.getElementsByClassName("val-nume")[0].innerHTML      
            
        if (nume_a != nume_b)                
            return semn * nume_a.localeCompare(nume_b);            
        else{                
            //se activeaza a 2-a cheie de sortare: pret                
             let dim_desc_a = a.getElementsByClassName("val-descriere")[0].innerHTML.length
            let dim_desc_b = b.getElementsByClassName("val-descriere")[0].innerHTML.length

        return    semn*(dim_desc_a - dim_desc_b);            
        }
    })  
              
        for (let art of v_articole){            
            art.parentElement.appendChild(art);        
        }    
    }


    //functie media preturilor
    function medie(){
        // console.log(e)
                let suma=0
                let nrElem = 0
                var articole=document.getElementsByClassName("produs");
                for (let art of articole){
                    if(art.style.display!="none")
                    {
                        suma+=parseFloat(art.getElementsByClassName("val-pret")[0].innerHTML)
                        nrElem ++;
                    }
                }
                var pSuma=document.createElement("p");
                pSuma.id="psuma";
                console.log(suma)
                let medie = suma/nrElem
                pSuma.innerHTML="<b>Media: </b>"+medie.toFixed(2);
                var sectiune=document.getElementById("produse");
                sectiune.parentElement.insertBefore(pSuma, sectiune);
                setTimeout(function(){
                    let p=document.getElementById("psuma")
                    if(p){
                        p.remove()
                    }
                }, 2000);
    }
    
    document.getElementById("sortCrescNume").onclick=function(){        
        sorteaza(1);   
    }    
     document.getElementById("sortDescrescNume").onclick=function(){        
        sorteaza(-1);    
    }

    document.getElementById("p-medie").onclick=function(){
        medie();
    }


// ================== COS VIRTUAL ====================

var checkboxuri = document.getElementsByClassName("select-cos");
for(let ch of checkboxuri){
    ch.onchange = function(){
        if(this.checked){
            iduriCos = localStorage.getItem("cos-virtual");
            if(!iduriCos){
                iduriCos = [];
            }
            else {
                iduriCos = "1,2,3,4";
                iduriCos = iduriCos.split(",");
            }
            iduriCos.push(this.value)
            localStorage.setItem("cos_virtual", iduriCod.join(","))
        }
    }
}


})

    