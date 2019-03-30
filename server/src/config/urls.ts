import { join } from "path";
import { Application } from "express";
import { Connection } from "typeorm";
import { AccountController } from "../controllers/AccountController";
import { CategoryController } from "../controllers/CategoryController";
import { ItemController } from "../controllers/ItemController";
import { DiningRoomController } from "../controllers/DiningRoomController";
import { TableController } from "../controllers/TableController";
import { OrderController } from "../controllers/OrderController";
import { IngredientController } from "../controllers/IngredientController";

export default function(app: Application, staticDir: string) {
    const controllers = {
        'accounts':    AccountController,
        'categories':  CategoryController,
        'items':       ItemController,
        'diningrooms': DiningRoomController,
        'tables':      TableController,
        'orders':      OrderController,
        'ingredients': IngredientController,
        // 'options':    require(join("..","controllers","OptionController")),
    };
    
    for (let key in controllers) {
        app.use("/api/"+key, controllers[key]);
    }
    app.get(/^\/api\//, (req, res) => res.status(404).json({"error":req.url+" not found"}));
    app.get("*", (_,res) => res.sendFile(staticDir+"/index.html"));
}
