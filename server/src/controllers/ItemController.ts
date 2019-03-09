import * as express from 'express';
import { Item } from "../entities/item";
import { getRepository } from "typeorm"; 
import { Category } from '../entities/category';
const router = express.Router();

router.get("/", async function (req, res) {
    res.json(await Item.find());
});
router.get("/:id", async function(req, res) {
    try {
        const i = await Item.findOneOrFail({
            where:[{id:req.params.id}],
            relations:["category", "options", "ingredients"]
        });
        res.json(i);
    } catch (reason) {
        console.log("error: "+reason);
        res.json(reason);
    }
});

export { router }