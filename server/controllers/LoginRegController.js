const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("user");

router.post("/login", function(req, res) {
    console.log(req.body);
    res.send(req.body);
});
router.post("/register", function(req,res) {
    console.log(req.body);
    res.send(req.body);
});
module.exports = router;