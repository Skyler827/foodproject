// initialize varibales
import express = require("express");
import session = require('express-session');
import bodyParser = require("body-parser");
import path = require("path");
import urls = require("./config/urls");

const initialize = (cb: ()=>void ) => require("./config/initialize")(cb); //wrapped to delay model lookup until after db.register()
const app = express();
const port = 3000;
const env = process.env.NODE_ENV || 'dev'; // either 'dev' or 'production'
const authentication = (app: Express.Application) => require("./config/authentication")(app); //wrapped to delay model lookup until after db.register()


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
    resave: true
};
app.use(function(req, res, next) {
    console.log("in server.js: "+req.method+": "+req.hostname+req.url);
    next();
});
// set http handlers
if (env == 'dev') {
    app.use(session(sessionOptions));
    authentication(app);
    urls(app, staticDir);

    // start server
    app.listen(port, function() {
        initialize(()=>console.log(`Example app listening on port ${port}`));
    });
}
