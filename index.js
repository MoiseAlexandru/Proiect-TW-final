const express = require("express");
const fs = require("fs");
const sharp = require("sharp");
const ejs = require("ejs");
const sass = require("sass");
const {Client} = require("pg");

var client = new Client({database: "postgres", user: "moise_alexandru", password: "1234", host: "localhost", port:5432});
client.connect();
app = express(); /// server numit app

app.set("view engine", "ejs");
app.use("/resurse", express.static(__dirname + "/resurse"));

let nrImaginiSlideshow = 0;

let optiuniMeniu = [
    {link: "papusi", nume: "Papusi"},
    {link: "masini-roboti", nume: "Masini si roboti"},
    {link: "jocuri-societate", nume: "Jocuri societate"},
    {link: "altele", nume: "Altele"}
]

app.get("*/galerie-animata.css", (req, res) => {
    //console.log("INTRA AICII!!!!");
    //console.log(req.url);
    var sirScss = fs.readFileSync(__dirname + "/resurse/scss/galerie-animata.scss").toString("utf8");
    rezScss = ejs.render(sirScss, {nrImagini:nrImaginiSlideshow, optiuniMeniu: optiuniMeniu});
    //console.log(nrImaginiSlideshow);
    var scssPath = __dirname + "/temp/galerie-animata.scss";
    fs.writeFileSync(scssPath, rezScss);
    
    try {
        compileResult = sass.compile(scssPath, {sourceMap: true});
        fs.writeFileSync(__dirname + "/temp/galerie-animata.css", compileResult.css);
        res.setHeader("Content-Type", "text/css");
        res.sendFile(__dirname + "/temp/galerie-animata.css")
    }
    catch(err) {
        console.log(err);
        res.send("Eroare de compilare css/scss/sass");
    }
})


app.get(["/", "/index", "/home"], (req, res) => {
    //console.log("pagini" + "/index");
    //console.log(obImages);
    nrImaginiSlideshow = Math.floor(Math.random() * 4) * 2 + 6;  /// (0, 1, 2, 3) * 2 la care adaug 6 -> (6, 8, 10, 12) imagini
    var imagesSlideshow = [];
    for(let image of obImages.images) {
        if(image.properties.includes("figurine-sale"))
            imagesSlideshow.push(image);
    }
    shuffleArray(imagesSlideshow);
    var shuffled = [];
    for(let i = 0; i < nrImaginiSlideshow; i++)
        shuffled.push(imagesSlideshow[i]);
    res.render("pagini/index", {ip: req.ip, imagesSlideshow: shuffled, optiuniMeniu: optiuniMeniu});
})



app.get("/about", (req, res) => {
    //console.log("pagini" + "/about");
    res.render("pagini/about", {optiuniMeniu: optiuniMeniu});
})



app.get("/*.ejs", (req, res) => {
    res.status(403).render("pagini/403", {optiuniMeniu: optiuniMeniu});
})


let luna = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
let zi = ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"]
    
app.get("/produse", (req, res) => {
    
    //console.log("pagini" + "/produse");
    client.query("select * from jucarii", (err, resQuery) => {
        //console.log(resQuery.rows);
        res.render("pagini/produse", {produse: resQuery.rows, luna: luna, zi: zi, optiuniMeniu: optiuniMeniu});
    })
   //res.render("pagini/galerie-animata", {images: {}});
})

app.get("/produse/*", (req, res) => {
    client.query("select * from jucarii", (err, resQuery) => {
        //console.log(resQuery.rows);
        let searchedFor = req.url.split('/')[2];
        //console.log(searchedFor);
        let elemente = [];
        for(let row of resQuery.rows)
            if(row.categorie == searchedFor)
                elemente.push(row);
        res.render("pagini/produse", {produse: elemente, luna: luna, zi: zi, optiuniMeniu: optiuniMeniu});
    })
})

app.get("/produs/*", (req, res) => {
    let produsId = req.url.split('/')[2];
    //console.log(produsId);
    client.query(`select * from jucarii where jucarii.id = ${produsId}`, (err, resQuery) => {
        //console.log(resQuery.rows[0]);
        res.render("pagini/pagina-produs", {prod: resQuery.rows[0], luna: luna, zi: zi, optiuniMeniu: optiuniMeniu});
    })
})

// pe pagina de galerie statica vreau sa afisez doar imaginile care au tagul "figurine-sale" (voi lua doar primele 12 rezultate)
app.get("/galerie-statica", (req, res) => {

    let products = [];
    for(let image of obImages.images) {
        if(products.length == 12)
            break;
        if(image.properties.includes("figurine-sale"))
            products.push(image);
    }

    res.render("pagini/galerie-statica", {images: products, optiuniMeniu: optiuniMeniu}, (err, rezRender) => {
        if(err) {
            if(err.message.includes("Failed to lookup view")) {
                console.log(err);
                res.status(404).render("pagini/404", {optiuniMeniu: optiuniMeniu});
            }
            else {
                res.render("pagini/eroare_generala", {optiuniMeniu: optiuniMeniu});
            }
        }
        else {
            console.log("Pagina se incarca");
            res.send(rezRender);
        }
    });
    res.end();
})


app.get("/galerie-animata", (req, res) => {
    nrImaginiSlideshow = Math.floor(Math.random() * 4) * 2 + 6;  /// (0, 1, 2, 3) * 2 la care adaug 6 -> (6, 8, 10, 12) imagini
    var imagesSlideshow = [];
    for(let image of obImages.images) {
        if(image.properties.includes("figurine-sale"))
            imagesSlideshow.push(image);
    }
    shuffleArray(imagesSlideshow);
    var shuffled = [];
    for(let i = 0; i < nrImaginiSlideshow; i++)
        shuffled.push(imagesSlideshow[i]);
    res.render("pagini/galerie-animata", {ip: req.ip, imagesSlideshow: shuffled, optiuniMeniu: optiuniMeniu});
})



app.get("/*", (req, res) => {
    //console.log("pagini" + req.url);
    res.render("pagini" + req.url, {images: obImages, optiuniMeniu: optiuniMeniu}, (err, rezRender) => {
        if(err) {
            if(err.message.includes("Failed to lookup view")) {
                console.log(err);
                res.status(404).render("pagini/404", {optiuniMeniu: optiuniMeniu});
            }
            else {
                res.render("pagini/eroare-generala.ejs", {optiuniMeniu: optiuniMeniu});
            }
        }
        else {
            console.log("Pagina se incarca");
            res.send(rezRender);
        }
    });
    res.end();
})


function createImages() {
    
    // pentru galerie

    var buf = fs.readFileSync(__dirname + "/resurse/json/gallery.json").toString("utf8");
    
    obImages = JSON.parse(buf);
    
    for(let image of obImages.images) {
        let imageName, extension;
        [imageName, extension] = image.file.split(".");
        
        image.og = `${obImages.gallery_path}/${image.file}`;

        let dim_small = 350;
        image.small = `${obImages.gallery_path}/small/${imageName}-${dim_small}.webp`;
        if(!fs.existsSync(image.small))
            sharp(__dirname + "/" + image.og).resize(dim_small, dim_small, {fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1}}).toFile(__dirname + "/" + image.small);
        
        let dim_medium = 450;
        image.medium = `${obImages.gallery_path}/medium/${imageName}-${dim_medium}.png`;
        if(!fs.existsSync(image.medium))
            sharp(__dirname + "/" + image.og).resize(dim_medium, dim_medium, {fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1}}).toFile(__dirname + "/" + image.medium);

        let dim_big = 700;
        image.big = `${obImages.gallery_path}/big/${imageName}-${dim_big}.png`;
        if(!fs.existsSync(image.big))
            sharp(__dirname + "/" + image.og).resize(dim_big, dim_big, {fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1}}).toFile(__dirname + "/" + image.big);
    }


    // pentru produse
    client.query("select * from jucarii", (err, resQuery) => {
        //console.log(resQuery.rows);
        for(let produs of resQuery.rows) {
            let imagineProdus = produs.imagine;
            let imageName, extension;
            [imageName, extension] = imagineProdus.split(".");
            let path = __dirname + "/resurse/images/produse";
            let resized = `${obImages.gallery_path}/resized/${imagineProdus}`;
            if(!fs.existsSync(resized))
                sharp(__dirname + "/resurse/images/produse/" + imagineProdus).resize(500, 500, {fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1}}).toFile(__dirname + "/resurse/images/produse/resized/" + imagineProdus);
        }
    })

}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

createImages();

app.listen(8080);
console.log("Server is running!");