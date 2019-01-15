const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = mongoose.model("order");
// const Seat = mongoose.model("seat");
// const ItemOrder = mongoose.model("item_order");
router.get("/", function(req, res) {
    res.send("ok");
});
router.get("/:tableNum(\d+)", function(req, res) {
    Order.findOne({
        tableNumber: req.params.tableNum,
        open: true
    }, (err, order) => {
        if (err) res.json(err);
        else {
            if (order) {res.json(order);}
            else {
                res.status(204).send("No open order at table "+req.params.tableNum);
            }
        }
    });
});
router.get("/:tableNum(\d+)/closed", function(req, res) {
    Order.findOne({
        tableNumber: req.params.tableNum,
        open: false
    }, (err, order) => {
        if (err) res.json(err);
        else {
            if (order) {res.json(order);}
            else {
                res.status(204).send("No closed orders at table "+req.params.tableNum);
            }
        }
    });
});
module.exports = router;
