const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Option_Menu = mongoose.model("option_menu");
const Option = mongoose.model("option");
router.get("/", function(req, res) {
    res.redirect("menus");
});
router.get("/menus", function(req, res) {
    Option_Menu.find({}, (err, data)=>{
        if (err) res.json(err);
        else res.json({menus:data});
    });
});
router.get("/menus/:id", function(req, res) {
    Option_Menu.findById({_id:req.params.id},(err, option_menu) => {
        if (err) res.json(err);
        else if (!option_menu) res.json({"error":"No such Option with id '"+req.params.id+"'."});
        else {
            Option.find({menu:option_menu._id}).select("name").exec((err, option_items) => {
                if (err) res.json(err);
                else {
                    res.json({menu:option_menu, items:option_items});
                }
            });
        }
    });
});
router.get("/items/:id", function(req, res) {
    Option.findById(req.params.id, (err, option_data)=>{
        if (err) res.json(err);
        else if (!option_data) res.json({error:"No such option item with id '"+req.params.id+"'"});
        else res.json(option_data);
    });
});

module.exports = router;