// initialize varibales
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const urls = require("./config/urls");

// initialize database
require("./config/db.js");

//set application settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('../client/dist/client/', {redirect: false}));

// set http handlers
urls(app);
app.get(/^api\//, (req, res)=> res.status(404).json(
    {"error":req.url+" not found"}));
app.get("/", (_, res) => res.status(500).send("could not load static files"));
app.get('*', (_, res) => res.redirect("/"));

// start server
app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
});
