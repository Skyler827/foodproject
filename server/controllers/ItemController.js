const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Item = mongoose.model("item");

router.get("/", function(req, res) {
    Item.find({}, function(err, data) {
        if (err) res.json(err);
        else res.json(data);
    });
});
router.get("/:id", function(req, res) {
    Item.findById(req.params.id, function(err, item) {
        if (err) res.json(err);
        else res.json(item);
    });
});
router.post("/", function(req, res) {
    Item.create(req.body, function(err, data) {
        if (err) res.json(err);
        else res.json(data);
    });
});
router.put("/:id", function(req, res) {
    Item.update({_id:req.body._id}, req.body, function(err, data) {
        if (err) res.json(err);
        else res.json(data);
    });
});
router.delete("/:id", function(req, res) {
    Item.deleteOne({_id:req.params.id}, function(err) {
        if (err) res.json(err);
        else res.status(204).send("");
    });
});

module.exports = router;