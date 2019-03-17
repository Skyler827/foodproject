import { join } from "path";
import { Application } from "express";
import { Connection } from "typeorm";
import { router as AccountController } from "../controllers/AccountController";
import { router as CategoryController } from "../controllers/CategoryController";
import { router as ItemController } from "../controllers/ItemController";
import { router as DiningRoomController } from "../controllers/DiningRoomController";
export default function(app: Application, staticDir: string, connection: Connection) {
    const controllers = {
        'accounts':    AccountController,
        'categories':  CategoryController,
        'items':       ItemController,
        'diningrooms': DiningRoomController,
        // 'ingredients':require(join("..","controllers","IngredientController")),
        // 'options':    require(join("..","controllers","OptionController")),
        // 'orders':     require(join("..","controllers","OrderController")),
        // 'tables':     require(join("..","controllers","TableController")),
        // 'users':      require(join("..","controllers","UserController")),
    };
    
    for (let key in controllers) {
        app.use("/api/"+key, controllers[key]);
    }
    app.get(/^\/api\//, (req, res) => res.status(404).json({"error":req.url+" not found"}));
    app.get("*", (_,res) => res.sendFile(staticDir+"/index.html"));
}
