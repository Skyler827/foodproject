import { MoreThanOrEqual, LessThan } from "typeorm";
import { Table } from "../entities/table";
import * as express from "express";
const router = express.Router();

router.get("/", async function(req, res) {
    const tables = await Table.find();
    const diningRooms = tables.map(t => Math.floor(t.number/100));
    const uniqueDR = [...new Set(diningRooms)];
    res.json(uniqueDR);
});
router.get("/:number", async function(req, res) {
    const tables = await Table.find({
        where: [
            MoreThanOrEqual(100*req.params.number),
            LessThan(100*(req.params.number)+1),
        ],
        relations: ["orders"]
    });
    res.json(tables.map(table => ({
        id: table.number,
        orders: table.orders.filter(o=>o.open)
    })));
});
export { router }
