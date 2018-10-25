const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("user");

router.post("/login", function(req, res) {

});
router.post("/register", function(req,res) {
    console.log(req.body);
    //User.create
});
module.exports = router;