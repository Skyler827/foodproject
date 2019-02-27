const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Category = mongoose.model("category");
const Item = mongoose.model("item");
router.get("/", function(req, res) {
    Category.find({}).select("name").exec((err,data) => {
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
router.get("/:id", function(req, res) {
    res.redirect("items");
})
router.get("/:id/items", function(req, res) {
    return new Promise((resolve, reject)=>{
        Category.findById(req.params.id, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    }).then(category=>{
        return new Promise((resolve, reject)=>{
            if (!category) {
                reject("No such category with id: "+req.params.id);
            } else {
                Item.find({category:category._id})
                .select("name").exec((err, items)=>{
                    if (err) reject(err);
                    else resolve(items);
                });
            }
        });
    }).then(items=>{
        res.json(items);
    }).catch(err=>{
        res.status(500).json(err);
    });
});
router.delete("/:id", function(req, res){
    Category.deleteOne({_id:req.params.id}, function(err){
        if (err) res.json(err);
        else res.status(204).send();
    });
});
module.exports = router;