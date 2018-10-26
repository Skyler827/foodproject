const User = require("mongoose").model("user");
const errors = require("./errors");
function handleCategories(req,res,next) {
    if (req.method == "GET") return next();
    else res.status(405).send(errors.methodNotAllowed(req.method));
}
function handleItems(req,res,next) {
    if (req.method == "GET") next();
    else if (req.session.userType == "manager"){
        if (req.method == "POST" || req.method == "PUT" 
        || req.method=="DELETE") next();
        else res.status(405).send(errors.methodNotAllowed(req.method));
    } else if (req.session.userType == "cook") {
        if (req.method == "PUT") next()
        else res.status(405).send(errors.methodNotAllowed(req.method));
    }
    else res.status(405).send(errors.methodNotAllowed(req.method));
}
function handleOrders(req,res,next) {
    
}
function handleTables(req,res,next) {}

function handleRequest(req, res, next) {
    const urlPath = req.url.split("/");
    console.log(req.url);
    if (urlPath.slice(0,1) == "api") {
        
        switch (urlPath.slice(1,2)) {
            case "categories": return handleCategories(req,res,next);
            case "items":  return handleItems(req,res,next);
            case "orders": return handleOrders(req,res,next);
            case "tables": return handleTables(req,res,next);
        }
    } else next();
}
module.exports = handleRequest;