import * as express from 'express';
import { Category } from "../entities/category"; 
import { Item } from "../entities/item";
const router = express.Router();

router.get("/", async function (_req, res) {
    const c = await Category.find();
    console.log(c);
    res.json(c);
});
router.get("/:id", async function(req, res) {
    const category = await Category.findByIds(req.params.id)[0];
    res.json(category);
});
router.get("/:id/items", async function(req, res) {
    try {
        const cats: Array<Category> = await Category.find({
            where: {id: Number.parseInt(req.params.id)}})
        console.log(cats);
        const cat  = cats[0];
        const items = await Item.find({where: {category: cat}});
        console.log(items);
        res.json(items);
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
});

export { router }