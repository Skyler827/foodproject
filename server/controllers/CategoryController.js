const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Category = mongoose.model("category");

router.get("/", function(req, res) {
    Category.find((err,data) => {
        if (err) res.json(err);
        else res.json(data);
    });
});
router.post("/", function(req, res) {
    console.log(req.body);
    Category.create(req.body).then(
        function onFulfilled(newCat) {
            res.json(newCat);
        }, function onRejected(err) {
            res.json(err)
        }
    );
});
router.get("/:id", function(req, res){
    Category.findById(req.params.id, function(err, data) {
        if (err) res.json(err);
        else res.json(data);
    });
});
router.delete("/:id", function(req, res){
    Category.deleteOne({_id:req.params.id}, function(err){
        if (err) res.json(err);
        else res.status(204).json({
            "message":"category id "+req.params.id+" deleted succesfully"
        });
    });
});
module.exports = router;