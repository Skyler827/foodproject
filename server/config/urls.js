const staticFilesError = require("./errors").errorHTML;

module.exports = function(app, staticDir) {
    const loginRegController = require("../controllers/LoginRegController")
    const controllers = {
        'categories':require("../controllers/CategoryController"),
        'items' :require("../controllers/ItemController"),
        'orders':require("../controllers/OrderController"),
        'tables':require("../controllers/TableController"),
        'users': require("../controllers/UserController")
    };
    
    for (key in controllers) {
        app.use("/api/"+key, controllers[key]);
    }
    app.use(loginRegController);
    app.get(/^api\//, (req, res)=> res.status(404).json({"error":req.url+" not found"}));
    app.get("*", (_,res)=>res.sendFile(staticDir+"/index.html"));
}
