const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = mongoose.model("order");

router.get("/", function(req, res) {
    res.json({
        "counter":0,
        "dining-1":1,
        "dining-2":2,
        "bar-counter":3,
        "patio":4
    });
});
router.get("/:diningRoomNumber", function(req, res) {
    console.log(req.param.diningRoomNumber);
    let x = req.params.diningRoomNumber;
    let query_conditions = {
        tableNumber:{
            $gte:x   *100,
            $lt:(x+1)*100
        },
        open: true
    };
    Order.find(query_conditions, (err, tables)=>{
        if (err) res.json(err);
        else res.json(tables);
    });
});

module.exports = router;