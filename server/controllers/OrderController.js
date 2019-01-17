const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = mongoose.model("order");
const Seat = mongoose.model("seat");
const ItemOrder = mongoose.model("item_order");

router.all("*", function(req, res, next) {
    console.log("in OrderController.js: "+req.method+": "+req.hostname+req.url);
    next();
});

router.get("/", function(req, res) {
    Order.find({}, function(err, data) {
        if (err) res.json(err);
        else res.json(data);
    });
});
router.get("/hello", function(req, res) {
    console.log("ayy");
    res.json("ayyyy");
});
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
    ).then(seats => seats.sort((a, b)=> Math.sign(a.seatNumber - b.seatNumber))
    ).then(seats =>
        Promise.all(seats.map(seat =>
            new Promise((resolve, reject) =>
                ItemOrder.find({seat:seat._id}, (err, itemOrders) => {
                    if (err) reject(err);
                    else resolve(itemOrders);
                })
            )
        ))
    ).then(itemOrdersBySeat => {
        res.json(itemOrdersBySeat);
    }).catch(err => {
        res.status(500).json(err);
    });
});
/**
 * TypeScript description of expected request body:
 * 
 * type ObjectId = String
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
 * }
 */
router.post("/:table", function(req, res) {
    Order.findOne({tableNumber:req.params.table, open: true}, (err, order)=>{
        if (err) res.status(500).json(err);
        else if (order && order.server != req.session.userId){
            res.status(401).json({error:"this table is being served by another server"});
        } else if (order) {

        }
    });
});

module.exports = router;
