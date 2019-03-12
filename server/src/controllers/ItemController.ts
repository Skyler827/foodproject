import * as express from 'express';
import { getManager} from "typeorm";
import { Item } from "../entities/item";
import { ItemIngredientAmount } from '../entities/item_ingredient_amount';
import { Ingredient } from '../entities/ingredient';
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
            const x = await getManager()
            .createQueryBuilder()
            .from(ItemIngredientAmount, "iaa")
            .innerJoinAndSelect(Ingredient, "ig", `"ig"."id" = "iia"."ingredientId"`)
            .where(`"iia"."itemId"=:id`, {id:item.id})
            .getMany();
            console.log(x);
            console.log(typeof x);
        } catch (e) {
            console.log(e);
        } finally {
            return item;
        }
        // return Object.assign(item, {ingredientAmounts: x});
    })
    .then(item => res.json(item))
    .catch(err => res.status(500).json(err));
});

export { router }
