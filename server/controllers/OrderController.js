const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = mongoose.model("order");
const Seat = mongoose.model("seat");
const ItemOrder = mongoose.model("item_order");
const OptionItem = mongoose.model("option");
const OptionMenu = mongoose.model("option_menu");
const User = mongoose.model('user');
const util = require('../config/util');

/**
 * gets a list of all orders, but not the items in each order
 */
router.get("/", function(req, res) {
    Order.find({}, function(err, data) {
        if (err) res.json(err);
        else res.json(data);
    });
});
/**
 * returns a nested array of items in a food order, given an order id.
 * body[n] is seat number n, an array of orders
 * body[n][k] is the k-th item the person on seat number n ordered
 * body[0], or seat zero, is the "for table"/platter seat.
 * if there are orders in seats 1,2 and 4, then the result will look like:
 * [null, <orders_arr>, <orders_arr>, null, orders_arr>]
 */
router.get("/:id", function(req, res) {
    new Promise((resolve, reject)=> {
        Order.findById(req.params.id, function(err, order) {
            if (err) reject(err);
            else resolve(order);
        });
    }).then(order => 
        new Promise((resolve, reject) => 
            Seat.find({order:order._id}, (err, seats)=>{
                if (err) reject(err);
                else resolve(seats);
            })
        )
    ).then(async seats => {
        const max_seat = seats.reduce(
            (max_seat, curr_seat) => max_seat > curr_seat.seatNumber ? max_seat : curr_seat.seatNumber,
            seats[0].seatNumber
        );
        let ans = new Array(max_seat);
        await Promise.all(seats.map(seat => {
            return new Promise((resolve, reject) =>
                ItemOrder.find({seat:seat._id}, (err, itemOrders) => {
                    if (err) reject(err);
                    else {
                        ans[seat.seatNumber] = itemOrders;
                        resolve();
                    }
                })
            )
        }));
        return ans;
    }).then(itemOrdersBySeat => {
        res.json(itemOrdersBySeat);
    }).catch(err => {
        res.status(500).json(err);
    });
});
/**
 * Submits an array of new item orders to the given order
 * 
 * TypeScript description of expected request body:
 * type ObjectId = String;
 * type request_body = {
 *     "item_orders": Array<{
 *         "item_id": ObjectId,
 *         "seat": Number,
 *         "option_line": String,
 *         "options": Object<ObjectId, Array<ObjectId>>,
 *         "ingredient_mods": Array<{
 *             "ingredient_id": ObjectId,
 *             "modification": String,
 *             "before": Boolean
 *         }>
 *     }>
 * };
 */
router.post("/:table", async function(req, res) {
    const server = await User.findOne({username:'skyler'}).then();
    new Promise((resolve, reject) => {
        Order.findOne({tableNumber:req.params.table, open: true}, (err, order)=>{
            if (err) reject(err);
            else if (order) resolve(order);
            else {
                const newOrder = {
                    server:server._id,
                    tableNumber: req.params.table,
                    orderNumber: 1,
                    open: true,
                    openTime: new Date(),
                };
                Order.create(newOrder).then(resolve).catch(reject);
            }
        });
    }).then(async order => {
        let seatNumbers = new Set();
        for (let i=0; i<req.body.item_orders.length; i++) {
            seatNumbers.add(req.body.item_orders[i].seat);
        }
        return new Promise((resolve, reject)=>{
            Seat.find({order:order._id}, (err, seats)=> {
                if (err) reject(err);
                else if (seats.length == 0) {
                    Promise.all(Array.from(seatNumbers.values(), seatNumber =>
                        Seat.create({seatNumber:seatNumber,order: order})
                    )).then(resolve);
                } else resolve(seats);
            });
        });
    }).then(async (seats) => {
        let maxSeatNumber = seats.reduce(
            (x,s) => (s.seatNumber > s) ? s.seatNumber : x,
            seats[0].seatNumber
        );
        let seat_arr = new Array(maxSeatNumber+1);
        for (let i=0; i<seats.length; i++) {
            let n = seats[i].seatNumber;
            seat_arr[n] = seats[i];
        }
        let item_orders = await Promise.all(
            req.body.item_orders.map(item_order => ( async () => {
                const options = await Promise.all(
                    Object.keys(item_order.options).map(menu_id => (async () => {
                        const menu = await OptionMenu.findById(menu_id).then();
                        return Promise.all(item_order.options[menu_id].map((option_id, idx)=>(async ()=>{
                            const item = await OptionItem.findById(option_id).then();
                            if (!item) {
                                return Promise.reject("failed to find option with id: "+option_id);
                            }
                            const isFree = menu.free_options >= idx;
                            const result = {
                                option_menu_name: menu.name,
                                option_item_name: item.name,
                                optionPriceCents: isFree? 0 : item.priceCents
                            };
                            return Promise.resolve(result);
                        })()));
                    })())
                ).then(util.flatten);
                item_order.options = options;
                item_order.seat = seat_arr[item_order.seat];
                return item_order;
            })())
        );
        return ItemOrder.create(item_orders);
    }).then(item_order_arr=> {
        res.json(item_order_arr);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

module.exports = router;
