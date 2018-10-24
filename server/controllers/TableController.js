const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Table = mongoose.model("table");

router.get("/", function(req, res) {
    Table.find({}, function(err, data) {
        if (err) res.json(err);
        else res.json(data);
    });
});
router.get("/:id", function(req, res) {
    Table.findById(req.params.id, function(err, order) {
        if (err) res.json(err);
        else res.json(order);
    });
});
router.post("/", function(req, res) {
    Table.create(req.body, function(err, data) {
        if (err) res.json(err);
        else res.json(data);
    });
});
router.put("/:id", function(req, res) {
    Table.update({_id:req.body._id}, req.body, function(err, data) {
        if (err) res.json(err);
        else res.json(data);
    });
});
router.delete("/:id", function(req, res) {
    Table.deleteOne({_id:req.params.id}, function(err) {
        if (err) res.json(err);
        else res.status(204).send("");
    });
});


module.exports = router;