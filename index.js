const express = require("express");

app = express(); /// server numit app

app.set("view engine", "ejs");
app.use("/resurse", express.static(__dirname + "/resurse"));

app.get(["/", "/index", "/home"], (req, res) => {
    console.log("pagini" + "/index");
    res.render("pagini/index", {ip: req.ip});
})

app.get("/about", (req, res) => {
    console.log("pagini" + "/about");
    res.render("pagini/about");
})

app.get("/*.ejs", (req, res) => {
    res.status(403).render("pagini/403.ejs");
})

app.get("/*", (req, res) => {
    console.log("pagini" + req.url);
    res.render("pagini" + req.url, (err, rezRender) => {
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

app.listen(8080);
console.log("Server is running!");