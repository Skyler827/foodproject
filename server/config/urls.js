const controllers = {
    'categories':require("../controllers/CategoryController"),
    'items' :require("../controllers/ItemController"),
    'orders':require("../controllers/OrderController"),
    'tables':require("../controllers/TableController"),
    'users' :require("../controllers/LoginRegController")
};

module.exports = function(app) {
    for (key in controllers) {
        app.use("/api/"+key, controllers[key]);
    }
    app.get(/^api\//, (req, res)=> res.status(404).json({"error":req.url+" not found"}));
    app.get("/", (_, res) => res.status(500).send("could not load static files"));
    app.get('*', (_, res) => res.redirect("/"));

}