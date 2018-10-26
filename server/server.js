// initialize varibales
const express = require("express");
const session = require('express-session')
const bodyParser = require("body-parser");
const path = require ("path");
const app = express();
const port = 3000;
const env = process.env.NODE_ENV || 'dev'; // either 'dev' or 'production'
const urls = require("./config/urls");
const authentication = function() {return require("./config/authentication");};
// initialize database
const db = require("./config/db.js").register();

//set application settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const dirnameLength = __dirname.split(path.sep).length;
const parentDir = __dirname.split(path.sep).slice(0,dirnameLength-1).join(path.sep);
const staticDir = parentDir + path.sep + ['client','dist','client'].join(path.sep);
app.use(express.static(staticDir, {redirect: false}));
const sessionOptions = {
    secret: 'sdkjvalkwejd;lfkv',
    saveUninitialized: true,
};

// set http handlers
if (env == 'dev') {
    app.use(session(sessionOptions));
    app.use(authentication());
    urls(app);

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

    sessionOptions.cookie.secure = true;
    app.use(session(sessionOptions))
    app.use((req, res, next) => {
        if (req.secure && req.headers.host == 'dojo-food.xyz')
            next();
        else res.redirect('https://dojo-food.xyz' + req.url);
    });
    app.use(authentication());
    urls(app);
    
    https.createServer(https_options, app).listen(port + 443);
    http.createServer(app).listen(port);
}
