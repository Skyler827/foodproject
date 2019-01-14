const path = require("path");
const staticFilesError = require("./errors").errorHTML;

module.exports = function(app, staticDir) {
    const loginRegController = require("../controllers/LoginRegController")
    const controllers = {
        'categories': require(path.join("..","controllers","CategoryController")),
        'items':      require(path.join("..","controllers","ItemController")),
        'orders':     require(path.join("..","controllers","OrderController")),
        'users':      require(path.join("..","controllers","UserController")),
        'options':    require(path.join("..","controllers","OptionController")),
        'ingredients':require(path.join("..","controllers","IngredientController"))
    };
    
    for (key in controllers) {
        app.use("/api/"+key, controllers[key]);
    }
    app.use(loginRegController);
    app.get(/^api\//, (req, res) => res.status(404).json({"error":req.url+" not found"}));
    app.get("*", (_,res) => res.sendFile(staticDir+"/index.html"));
}
