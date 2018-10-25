// initialize varibales
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const env = process.env.NODE_ENV || 'dev'; // either 'dev' or 'production'
const path = require ("path");
// initialize database
const db = require("./config/db.js").register();

//set application settings
const urls = require("./config/urls");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
console.log(__dirname);
const dirnameLength = __dirname.split(path.sep).length;
const parentDir = __dirname.split(path.sep).slice(0,dirnameLength-1).join(path.sep);
const staticDir = parentDir + path.sep + ['client','dist','client'].join(path.sep);
console.log(staticDir)
app.use(express.static(staticDir, {redirect: false}));

// set http handlers
urls(app);
if (env == 'dev') {
    // start server
    app.listen(port, function() {
        console.log(`Example app listening on port ${port}!`)
    });
} else if (env == 'production') {
    // serve over https only
    const https = require("https");
    const http = require("http");
    const fs = require("fs");

    const key = fs.readFileSync('/etc/letsencrypt/live/dojo-food.xyz/privkey.pem');
    const cert = fs.readFileSync( '/etc/letsencrypt/live/dojo-food.xyz/fullchain.pem' );
    const https_options = {key: key, cert: cert};

    app.use((req, res, next) => {
        if (req.secure && req.headers.host == 'dojo-food.xyz')
            next();
        else res.redirect('https://dojo-food.xyz' + req.url);
    });

    https.createServer(https_options, app).listen(port + 443);
    http.createServer(app).listen(port);
}
