const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Item = mongoose.model("item");
const OptionMenu = mongoose.model("option_menu");
const OptionItem  = mongoose.model("option");
router.get("/", function(req, res) {
    Item.find({}).select("name").exec(function(err, data) {
        if (err) res.json(err);
        else res.json(data);
    });
});
router.get("/:id", function(req, res) {
    new Promise((resolve, reject) => {
        Item.findById(req.params.id, function(err, item) {
            if (err) reject(err);
            else resolve(item);
        });
    }).then(item=>
        Promise.all(item.options.map((optionMenuId) => 
            new Promise((resolve, reject) => 
                OptionMenu.findById(optionMenuId, (err, optionMenu) => {
                    if (err) reject(err);
                    else resolve(optionMenu)
                })
            )
        )).then(optionMenus => {
            item.optionMenus = optionMenus;
            console.log(JSON.stringify(item));
            console.log(item.optionMenus);
            return item
        })
    ).then(item => 
        Promise.all(item.optionMenus.map((optionMenu, i, arr) =>
            new Promise((resolve, reject) =>
                OptionItem.find({menu:optionMenu}, (err, optionItems) => {
                    if (err) reject(err);
                    else {
                        item.optionMenus[i].items = optionItems
                        resolve()
                    }
                })
            )
        )).then(()=> {
            return item;
        })
    ).then(item => res.json(item)
    ).catch(err => {
        console.log(err);
        res.status(500).json(err)
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