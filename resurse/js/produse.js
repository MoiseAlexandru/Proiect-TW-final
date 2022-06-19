
window.onload = function() {
    document.getElementById("filtrare").onclick = function() {
        var valNume = document.getElementById("inp-nume").value.toLowerCase();
        
        var butoaneRadio = document.getElementsByName("gr_rad");
        for(let rad of butoaneRadio) {
            if(rad.checked) {
                var valPret = rad.value;
                break;
            }
        }
        var minPret = 0, maxPret = 2030;
        if(valPret != "tot") {
            [minPret, maxPret] = valPret.split(':');
            minPret = parseInt(minPret);
            maxPret = parseInt(maxPret);
            //console.log("intra", minAn, maxAn);
        }

        var articole = document.getElementsByClassName("produs");
        //console.log(articole.length);
        for(let art of articole) {
            art.style.display = "none";
            let numeArt = art.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            //console.log("intra cu: ", numeArt, valNume);

            let cond1 = numeArt.startsWith(valNume);
            
            let pretArt = parseInt(art.getElementsByClassName("val-pret")[0].innerHTML);
            let cond2 = (minPret <= pretArt && pretArt <= maxPret);
            
            let conditieFinala = cond1 && cond2;
            //console.log("'" + valNume + "' '" + numeArt + "'");
            if(conditieFinala)
                art.style.display = "block";
        }
    }
}