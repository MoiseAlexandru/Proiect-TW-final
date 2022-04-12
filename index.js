const express = require("express");

app = express(); /// server numit app

app.set("view engine", "ejs");
app.use("/resurse", express.static(__dirname + "/resurse"));

app.get(["/", "/index", "/home"], (req, res) => {
    console.log(__dirname);
    res.render("pagini/index");
})

app.get("/*", (req, res) => {
    console.log("pagini" + req.url);
    res.render("pagini" + req.url);
    res.end();
})

app.listen(8080);
console.log("Server is running!");