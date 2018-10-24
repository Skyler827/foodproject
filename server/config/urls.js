module.exports = function(app) {
    const controllers = {
        'categories':require("./controllers/CategoryController"),
        'items':require("./controllers/ItemController"),
        'orders':require("./controllers/OrderController"),
        'tables':require("./controllers/TableController"),
        'users': require("./controllers/UserController"),
    };
    
    for (key in controllers) {
        app.use("/api/"+key, controllers[key]);
    }
}