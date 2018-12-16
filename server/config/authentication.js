const errors = require("./errors");
const mongoose = require("mongoose");
const User = mongoose.model("user");
const Order = mongoose.model("order");

function handleCategories(req,res,next) {
    if (req.method == "GET") return next();
    else res.status(405).send(errors.methodNotAllowed(req.method));
}
function handleItems(req, res, next) {
    if (req.method == "GET")
        next();
    else if (req.session.userType == "manager")
        next();
    else if (req.session.userType == "cook" && req.method == "PUT") 
        next();    
    else res.status(403).send(errors.forbidden);
}
function handleOrders(req, res, next) {
    if (req.session.userType == "manager") {
        next();
    } else if (["bartender","server","cashier"].indexOf(req.session.userType) > -1) {
        if (req.url == "/api/orders" && req.method == "GET") next();
        else Order.findById(req.params.id,(err,data)=>{
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                console.log(data);
                next();
            }
        });
    }
}
function handleTables(req, res, next) {
    next();
}
let handleRequests = function(app) {
    app.use((req,res,next) => {
        if (["GET","POST","PUT","DELETE"].indexOf(req.method) == -1)
        return res.status(405).send(errors.methodNotAllowed(req.method))
        const urlPath = req.url.split("/");
        if (urlPath.length > 2 && urlPath[1] == "api") {
            switch (urlPath[2]) {
                case "categories": return handleCategories(req,res,next);
                case "items":  return handleItems(req,res,next);
                case "orders": return handleOrders(req,res,next);
                case "tables": return handleTables(req,res,next);
                default: next();
            }
        } else next();
    });
};
module.exports = handleRequests;