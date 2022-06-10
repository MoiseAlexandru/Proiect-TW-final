const express = require("express");
const fs = require("fs");
const sharp = require("sharp");

app = express(); /// server numit app

app.set("view engine", "ejs");
app.use("/resurse", express.static(__dirname + "/resurse"));

app.get(["/", "/index", "/home"], (req, res) => {
    console.log("pagini" + "/index");
    //console.log(obImages);
    res.render("pagini/index", {ip: req.ip, images: obImages});
})

app.get("/about", (req, res) => {
    console.log("pagini" + "/about");
    res.render("pagini/about");
})

app.get("/*.ejs", (req, res) => {
    res.status(403).render("pagini/403");
})

app.get("/*", (req, res) => {
    console.log("pagini" + req.url);
    res.render("pagini" + req.url, {images: obImages}, (err, rezRender) => {
        if(err) {
            if(err.message.includes("Failed to lookup view")) {
                console.log(err);
                res.status(404).render("pagini/404");
            }
            else {
                res.render("pagini/eroare_generala");
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
    
    var buf = fs.readFileSync(__dirname + "/resurse/json/gallery.json").toString("utf8");
    
    obImages = JSON.parse(buf);
    
    for(let image of obImages.images) {
        let imageName, extension;
        [imageName, extension] = image.file.split(".");
        
        image.og = `${obImages.gallery_path}/${image.file}`;

        let dim_small = 150;
        image.small = `${obImages.gallery_path}/small/${imageName}-${dim_small}.webp`;
        if(!fs.existsSync(image.small))
            sharp(__dirname + "/" + image.og).resize(dim_small, dim_small, {fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0.5}}).toFile(__dirname + "/" + image.small);
        
        let dim_medium = 350;
        image.medium = `${obImages.gallery_path}/medium/${imageName}-${dim_medium}.png`;
        if(!fs.existsSync(image.medium))
            sharp(__dirname + "/" + image.og).resize(dim_medium, dim_medium, {fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0.5}}).toFile(__dirname + "/" + image.medium);

        let dim_big = 700;
        image.big = `${obImages.gallery_path}/big/${imageName}-${dim_big}.png`;
        if(!fs.existsSync(image.big))
            sharp(__dirname + "/" + image.og).resize(dim_big, dim_big, {fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0.5}}).toFile(__dirname + "/" + image.big);
    }
    
}

createImages();

app.listen(8080);
console.log("Server is running!");