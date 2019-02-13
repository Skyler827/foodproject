const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("user");
const Order = mongoose.model("order");
const Seat = mongoose.model("seat");
const ItemOrder = mongoose.model("item_order");
router.get("/", function(req, res) {
    res.send("ok");
});
router.get("/:table", async function(req, res) {
    const server = await User.findOne({username:'skyler'}).then();
    new Promise((resolve, reject)=>
        Order.find({tableNumber:req.params.table, open:true, server:server._id})
        .exec((err,orders)=>{
            if (err) reject(err);
            else if (!orders) {
                res.status(204).send("No open order at table "+req.params.tableNum);
            } else resolve(orders);
        })
    ).then(orders=>
        new Promise((resolve, reject)=>
            Seat.find({order:{$in:orders}}, (err, seats)=>{
                if (err) reject(err);
                else resolve(seats);
            })
        )
    ).then(seats=>{
        let seatMap = new Map();
        let maxSeat = 0;
        for (let seat of seats) {
            seatMap.set(seat._id.toString(), seat.seatNumber);
            if (seat.seatNumber > maxSeat){
                maxSeat = seat.seatNumber;
            }
        }
        console.log(seatMap);
        return new Promise((resolve, reject)=>
            ItemOrder.find({seat:{$in:seats}})
            .populate("item",["name"])
            .exec((err,itemOrders)=>{
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve([itemOrders, seatMap, maxSeat]);
                }
            })
        )
    }).then(x=>{
        let itemOrders = x[0];
        let seatMap = x[1];
        let maxSeat = x[2];
        let seats = Array(maxSeat + 1);
        for(let order of itemOrders) {
            let seatN = seatMap.get(order.seat.toString());
            if (!seatN) {throw new Error("seatN shouldnt be undefined");}
            if (seats[seatN]) {
                seats[seatN].push(order);
            } else {
                seats[seatN] = [order];
            }
        }
        return seats;
    }).then(seats=>{
        res.json(seats)
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err)
    });
});

module.exports = router;
