module.exports = function(app) {
    const controllers = {
        'categories':require("../controllers/CategoryController"),
        'items':require("../controllers/ItemController"),
        'orders':require("../controllers/OrderController"),
        'tables':require("../controllers/TableController")
    };
    
    for (key in controllers) {
        app.use("/api/"+key, controllers[key]);
    }
}