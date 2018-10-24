const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const urls = require("./config/urls");
require("./config/db.js");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('../client/dist/client/', {redirect: false}));
urls(app);
app.get(/^api\//, (req, res)=> res.status(404).json(
    {"error":req.url+" not found"}));
app.get('*', (_, res) => res.redirect("/"));
app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
});
