import * as express from 'express';
import { Category } from "../entities/category"; 
const router = express.Router();

router.get("/", async function (req, res) {
    res.json(await Category.find());
});

export { router }