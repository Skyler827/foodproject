const path = require("path");
const staticFilesError = require("./errors").errorHTML;
module.exports = function(app, staticDir) {
    const loginRegController = require(path.join("..","controllers","LoginRegController"));
    const controllers = {
        'categories': require(path.join("..","controllers","CategoryController")),
        'diningrooms':require(path.join("..","controllers","DiningRoomController")),
        'ingredients':require(path.join("..","controllers","IngredientController")),
        'items':      require(path.join("..","controllers","ItemController")),
        'options':    require(path.join("..","controllers","OptionController")),
        'orders':     require(path.join("..","controllers","OrderController")),
        'tables':     require(path.join("..","controllers","TableController")),
        'users':      require(path.join("..","controllers","UserController")),
    };
    
    for (key in controllers) {
        app.use("/api/"+key, controllers[key]);
    }
    app.use(loginRegController);
    app.get(/^\/api\//, (req, res) => res.status(404).json({"error":req.url+" not found"}));
    app.get("*", (_,res) => res.sendFile(staticDir+"/index.html"));
}
