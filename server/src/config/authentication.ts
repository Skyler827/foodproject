import { Application, Request, Response, NextFunction } from "express";

import errors = require("./errors");

function handleCategories(req: Request, res: Response, next: NextFunction) {
    if (req.method == "GET") return next();
    else res.status(405).send(errors.methodNotAllowed(req.method));
}
function handleItems(req: Request, res: Response, next: NextFunction) {
    if (req.method == "GET")
        next();
    else if (req.session? req.session.userType == "manager": false)
        next();
    else if (req.session? req.session.userType == "cook" && req.method == "PUT": false) 
        next();    
    else res.status(403).send(errors.forbidden);
}
function handleOrders(req: Request, res: Response, next: NextFunction) {
    if (req.session? req.session.userType == "manager": false) {
        next();
    } else if (req.session? ["bartender","server","cashier"].indexOf(req.session.userType) > -1: false) {
        return next();
    } else {
        next();
        // res.status(403).json(errors.forbidden);
    }
}
function handleTables(req: Request, res: Response, next: NextFunction) {
    next();
}
let handleRequests = function(app: Application) {
    app.use((req: Request, res: Response, next: NextFunction) => {
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