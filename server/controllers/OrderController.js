const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = mongoose.model("order");
const Seat = mongoose.model("seat");
const ItemOrder = mongoose.model("item_order");

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
 *         "seat": Number
 *         "options": Object<ObjectId, Array<ObjectId>>,
 *         "ingredient_mods": Array<{
 *             "ingredient_id": ObjectId,
 *             "modification": String,
 *             "before": Boolean
 *         }>
 *     }>
 * };
 */
router.post("/:table", function(req, res) {
    Order.findOne({tableNumber:req.params.table, open: true}, (err, order)=>{
        if (err) {res.status(500).json(err);}
        else if (order) {
            
        }
    });
});

module.exports = router;
