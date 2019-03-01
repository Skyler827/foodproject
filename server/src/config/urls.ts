import { join } from "path";
import { Application } from "express";
import { Connection } from "typeorm";

export default function(app: Application, staticDir: string, connection: Connection) {
    // const loginRegController = require(join("..","controllers","LoginRegController"));
    const controllers = {
        // 'categories': require(join("..","controllers","CategoryController")),
        // 'diningrooms':require(join("..","controllers","DiningRoomController")),
        // 'ingredients':require(join("..","controllers","IngredientController")),
        // 'items':      require(join("..","controllers","ItemController")),
        // 'options':    require(join("..","controllers","OptionController")),
        // 'orders':     require(join("..","controllers","OrderController")),
        // 'tables':     require(join("..","controllers","TableController")),
        // 'users':      require(join("..","controllers","UserController")),
    };
    
    for (let key in controllers) {
        app.use("/api/"+key, controllers[key]);
    }
    // app.use(loginRegController);
    app.get(/^\/api\//, (req, res) => res.status(404).json({"error":req.url+" not found"}));
    app.get("*", (_,res) => res.sendFile(staticDir+"/index.html"));
}
