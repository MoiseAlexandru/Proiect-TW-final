const express = require("express");

app = express(); /// server numit app

app.use("/resurse", express.static(__dirname + "/resurse"));

app.get("/", (req, res) => {
    console.log(__dirname);
    res.sendFile(__dirname + "/index.html");
})

app.get("/ceva", (req, res, next) => {
    res.write("salut1");
    next();
    //res.end();
})
app.get("/ceva", (req, res, next) => {
    res.write("salut2");
    next();
})

app.get("/*", (req, res) => {
    res.write("cerere generala");
    res.end();
})

app.listen(8080);
console.log("Server is running!");