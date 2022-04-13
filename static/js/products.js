window.addEventListener("load", function(){
    // bara de pret
    document.getElementById("inp-pret").onchange = function(){
        document.getElementById("infoRange").innerHTML = " (" + this.value + ") ";
    }




    // buton filtrare
    document.getElementById("filtrare").onclick = function(){
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


        var valPret = document.getElementById("inp-pret").value;

        var valCategorie = document.getElementById("inp-categorie").value;

        var articole = document.getElementsByClassName("produs");


        for(let art of articole){
            art.style.display = "none";

            // filtrare nume
            let numeArt = art.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            let cond1 = (numeArt.startsWith(valNume));

            // filtrare marime
            let marimeArt =  parseInt(art.getElementsByClassName("val-marime")[0].innerHTML);
            let cond2 = (minMarime <= marimeArt && maxMarime >= marimeArt)

            // filtrare pret
            let pretArt =  parseInt(art.getElementsByClassName("val-pret")[0].innerHTML);
            let cond3 = (valPret <= pretArt);

            // filtare categorie colectie
            let categorieArt = art.getElementsByClassName("val-categorie")[0].innerHTML;
            let cond4 = (valCategorie == "toate") || (categorieArt == valCategorie);

            // filtrare finala
            let conditieFinala = cond1 && cond2 && cond3 && cond4;
            if(conditieFinala)
                art.style.display = "block";
        }
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
        document.getElementById("inp-pret").value = 0;
        document.getElementById("infoRange").innerHTML = " (0) ";

    }



    // // buton de sortare
    // document.getElementById("sortCrescNume").onclick = function(){
    //     var articole = document.getElementsByClassName("produs");
    //     var v_articole = Array.from(articole);
    //     v_articole.sort(function(a, b){
    //         let nume_a = a.getElementsByClassName("val-nume")[0].innerHTML
    //         let nume_b = b.getElementsByClassName("val-nume")[0].innerHTML
    //         let comp = nume_a.localeCompare(nume_b);
    //         if(comp != 0)
    //             return comp;
    //         else {
    //             // se activeaza a doua cheie de sortare

    //             let dim_desc_a = a.getElementsByClassName("val-descriere")[0].innerHTML.length
    //             let dim_desc_b = b.getElementsByClassName("val-descriere")[0].innerHTML.length
    //             return dim_desc_a.localeCompare(dim_desc_b);
    //         }
    //     })
    //     for (let art of v_articole){
    //         art.parentElement.appendChild(art);
    //     }

    // }   
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
    
    document.getElementById("sortCrescNume").onclick=function(){        
        sorteaza(1);   
    }    
     document.getElementById("sortDescrescNume").onclick=function(){        
        sorteaza(-1);    
    }

})

    //idk
    window.onkeydown=function(e){
        console.log(e)
        if(e.key=='c' && e.altKey){
            if(! document.getElementById("psuma")){
                let suma=0
                var articole=document.getElementsByClassName("produs");
                for (let art of articole){
                    if(art.style.display!="none")
                        suma+=parseInt(art.getElementsByClassName("val-pret")[0].innerHTML)
                }
                var pSuma=document.createElement("p");
                pSuma.id="psuma";
                pSuma.innerHTML="<b>Suma: </b>"+suma;
                var sectiune=document.getElementById("produse");
                sectiune.parentElement.insertBefore(pSuma, sectiune);
                setTimeout(function(){
                    let p=document.getElementById("psuma")
                    if(p){
                        p.remove()
                    }
                }, 2000);
            }
        }
    }