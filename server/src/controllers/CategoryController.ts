import * as express from 'express';
import { Category } from "../entities/category"; 
const router = express.Router();

router.get("/", async function (req, res) {
    res.json(await Category.find());
});
router.get("/:id", async function(req, res) {
    const category = await Category.findByIds(req.params.id)[0];
    res.json(category);
});

export { router }