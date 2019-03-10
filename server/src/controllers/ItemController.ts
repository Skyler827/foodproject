import * as express from 'express';
import { Item } from "../entities/item";
const router = express.Router();

router.get("/", async function (req, res) {
    Item.find({relations: ["category"]})
    .then(items => res.json(items))
    .catch(err => res.status(500).json(err));
});

router.get("/:id", async function(req, res) {
    Item.findOneOrFail({
        where:[{id:req.params.id}],
        relations: ["category", "options", "ingredients"]
    })
    .then(item => res.json(item))
    .catch(err => res.status(500).json(err));
});

export { router }
