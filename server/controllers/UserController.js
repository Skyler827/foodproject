const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("user");

router.get("/users", function(req, res) {
    res.json({});
});

module.exports = router;
