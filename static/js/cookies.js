window.addEventListener("DOMContentLoaded", function(){
    // dupa ce a citit tot html-ul, dar inainte de a incarca imagini, video, etc
    checkBanner();
})

function setCookie(nume, val, timpExp, path="/"){ //timpExp e dat in milisecunde
    d = new Date();
    d.setTime(d.getTime() + timpExp);
    document.cookie = `${nume} = ${val}; expires= ${d.toUTCString()}; path=${path}`; // nu suprascrie; doar adauga
}

function getCookie(nume){
    v_cookie = document.cookie.split(";");
    for(let c of v_cookie){
        c.trim(); // "a=b"
        if(c.startsWith(nume +"="))
            return c.subtring(nume.length + 1);
    }
}

function deleteCookie(nume){
    setCookie(nume, "", 0);
}

///TODO: delete all cookies
// la fel ca get cookies  + un split de nume si valoare

//functie de verificare a faptului ca exista cookie-ul "acceptat banner",
// caz in care ascundem bannerul. Altfel, daca nu exista cookie-ul
// afisam bannerul si setam o functie la click pe button prin care adugam cookie-ul (care va expira dupa 5 secunde).

function checkBanner(){
    let val_cookie = getCookie("acceptat_banner");
    if(val_cookie){
        document.getElementById("banner").style.display = "none";
    }
    else {
        document.getElementById("banner").style.display = "block";
        document.getElementById("ok_cookies").onclick = function(){
            setCookie("acceptat_banner", "true", 5000) // expira dupa 5 secunde
            document.getElementById("banner").style.display = "none";   
        }

    }
}