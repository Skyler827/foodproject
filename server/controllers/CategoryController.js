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
router.post("/", function() {});

module.exports = router;