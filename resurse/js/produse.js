
window.onload = function() {


    document.getElementById("inp-an").onchange = function() {
        document.getElementById("infoRange").innerHTML = " (" + this.value + ")";
    }


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

        var valAn = document.getElementById("inp-an").value;


        var articole = document.getElementsByClassName("produs");
        //console.log(articole.length);
        for(let art of articole) {
            art.style.display = "none";
            let numeArt = art.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            //console.log("intra cu: ", numeArt, valNume);

            let cond1 = numeArt.startsWith(valNume);
            
            let pretArt = parseInt(art.getElementsByClassName("val-pret")[0].innerHTML);
            let cond2 = (minPret <= pretArt && pretArt <= maxPret);
            
            let anArt = parseInt(art.getElementsByClassName("val-an")[0].innerHTML);
            let cond3 = (anArt <= valAn);
            console.log("val an: ", valAn, "anArt: ", anArt);

            let conditieFinala = cond1 && cond2 && cond3;
            //console.log("'" + valNume + "' '" + numeArt + "'");
            if(conditieFinala)
                art.style.display = "block";
        }
    }
}