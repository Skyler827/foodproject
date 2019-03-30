import * as express from 'express';
import { getRepository } from "typeorm";
import { Table } from "../entities/table";
import { Order } from "../entities/order";
import { Seat } from "../entities/seat";
import { ItemOrder } from "../entities/item_order";
import { AllItemOrder } from '../def/newItemOrder';
const router = express.Router();

router.post("/:tableNum", async function(req, res) {
    try {
        let table = await Table.findOne({where:{number:req.params.tableNum}});
        let order = await Order.findOne({where:{table:table, open: true}});
        if (!table) {
            table = new Table();
            table.number = req.params.tableNum;
            await table.save();
            order = new Order();
            order.table = table;
        }
        console.log(table);
        console.log(order);
        console.log(req.body);
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
    const data: AllItemOrder = req.body;
    for (let seatList of data) {

    }
});

export { router as OrderController }