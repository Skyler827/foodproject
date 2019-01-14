const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = mongoose.model("order");
const ItemOrder = mongoose.model("item_order");

router.get("/", function(req, res) {
    Order.find({}, function(err, data) {
        if (err) res.json(err);
        else res.json(data);
    });
});
router.get("/:id", function(req, res) {
    Order.findById(req.params.id, function(err, order) {
        if (err) res.json(err);
        else res.json(order);
    });
});
// new order on a given table
// lets 
// add to order on table by table number
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