import * as express from 'express';
import { getConnection } from "typeorm";
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
        relations: ["category", "options", "ingredientAmounts"]
    }).then(async item => {
        try {
            const x = await getConnection()
            .query(`SELECT 
            iia.quantity, iia."ingredientId", ig.name
            FROM item_ingredient_amount iia
            JOIN ingredient ig ON ig.id = iia."ingredientId"
            WHERE iia."itemId"=$1`, [item.id]);
            console.log(x);
            return Object.assign(item, {ingredientAmounts: x})
        } catch (e) {
            console.log(e);
            return item;
        }
    })
    .then(item => res.json(item))
    .catch(err => res.status(500).json(err));
});

export { router }
