const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("user");

router.all("*", function(req, res, next) {
    console.log("in UserController.js: "+req.method+": "+req.hostname+req.baseUrl);
    next();
});

router.get("/", function(req, res) {
    User.find({}, (err, data)=> {
        if (err) res.status(500).json(err);
        else res.json(data);
    });
});
router.post("/", function(req, res) {
    User.create({}).then(result => {
        res.status(201);
        res.set("Location", "/api/users/"+result._id);
        res.send();
    }).catch(err => {
        res.status(500);
        res.json(err);
    });
});
router.get("/:id", function(req, res) {
    User.find({_id:req.params.id}, (err, data) => {
        if (err) res.status(500).json(err);
        else res.json(data);
    });
});
module.exports = router;
