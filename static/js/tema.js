window.addEventListener("load", function(){
    var tema = localStorage.getItem("tema");
    if(tema)
        document.body.classList.add("dark");
    else
        document.body.classList.remove("dark");

    document.getElementById("btn_tema").onclick = function(){

        var tema = localStorage.getItem("tema");
        if(tema)
            localStorage.removeItem("tema");
        else
            localStorage.setItem("tema", "dark");

        document.body.classList.toggle("dark");
        
    }
});