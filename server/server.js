const express = require("express")
const app = express()
const port = 3000
const bodyParser = require("body-parser");
require("./config/db.js");        
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('../client/dist/client/'))
require("./config/urls")(app);

const s = "Hello world from food app! <br>"+
    "Future home our state of the art food ordering service!<br>"+
    "Planned Features:<br>"+
    "<ol>"+
    "<li>Sign in as manager</li>"+
    "<li>Create, Read, Update and Delete Food items in the menu</li>"+
    "<li>Waiters/Waitresses can log in and view/submit orders for items</li>"+
    "<li>Kitchen user may log in and see input orders and mark them as done</li>"+
    "<li>Waiter/Waitress Users can mark completed ordered food as picked up/delivered</li>"+
    "<li>Food orders' ingredients may be customized, and a list of ingredients is related to each item</li>"+
    "<li>Food orders may be customized with several options</li>"+
    "</ol>";


app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
});
