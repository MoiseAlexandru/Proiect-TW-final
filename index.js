const express = require("express");

app = express(); /// server numit app

app.get("/ceva", (req, res) => {
    res.write("salut");
    res.end();
})

app.listen(8080);
console.log("Server is running!");