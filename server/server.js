// initialize varibales
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const env = process.env.NODE_ENV || 'dev'; // either 'dev' or 'production'

// initialize database
const db = require("./config/db.js").register();

//set application settings
const urls = require("./config/urls");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const dirnameLength = __dirname.split("/").length;
const parentDir = __dirname.split("/").slice(0,dirnameLength-1).join("/");
app.use(express.static(parentDir+'/client/dist/client/', {redirect: false}));

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
