const express = require("express")
const app = express()
const port = 3000
const bodyParser = require("body-parser");
require("./config/db.js");        
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('../client/dist/client/'))
require("./config/urls")(app);

app.get(/^(?!\/api).*$/, (_, res) => res.redirect("/"));
app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
});
