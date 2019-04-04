import * as express from 'express';
import { Item } from "../entities/item";
import { Table } from "../entities/table";
import { Order } from "../entities/order";
import { Seat } from "../entities/seat";
import { ItemOrder } from "../entities/item_order";
import { AllItemOrder } from '../def/newItemOrder';
import { KitchenOrder } from '../entities/kitchen_order';
const router = express.Router();

router.post("/:tableNum", async function(req, res) {
    try {
        let table: Table;
        let order: Order;
        let kitchenOrder = new KitchenOrder();
        let lookupTable = await Table.findOne({where:{number: req.params.tableNum}});
        let lookupOrder = lookupTable ? await Order.findOne({where:{table: lookupTable, open: true}}): undefined;
        await kitchenOrder.save();
        if (!lookupTable) {
            table = new Table();
            table.number = +req.params.tableNum;
            await table.save();
        } else {
            table = lookupTable;
        }
        if (!lookupOrder) {
            order = new Order();
        } else {
            order = lookupOrder;
        }
        order.table = table;

        const data: AllItemOrder = req.body;
        const created: Array<Array<ItemOrder>> = await Promise.all(data.map(async seatList => {
            if (!seatList || seatList.length == 0) return [];
            let seat: Seat;
            let lookUpSeat = await Seat.findOne({where:{
                seatNumber: seatList[0].seat,
                table: table
            }});
            if (!lookUpSeat) {
                seat = new Seat();
                seat.seatNumber = seatList[0].seat;
                seat.table = table;
                seat.order = order;
                await seat.save();
            } else {
                seat = lookUpSeat;
            }
            return Promise.all(seatList.map(async order => {
                console.log("adding new order for: "+order.itemName);
                let io = new ItemOrder();
                let item = await Item.findOne({where: {id: order.item}});
                if (!item) return Promise.reject("No such item ID: "+order.item);
                io.item = item;
                io.seat = seat;
                io.kitchenOrder = kitchenOrder;
                io.optionLine = order.option_line || "";
                // io.optionOrders = order.options;
                return io.save();
            }));
        }));
        res.json(created);
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    } finally {
        return 0;
    }
});

export { router as OrderController }