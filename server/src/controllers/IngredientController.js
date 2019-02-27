const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Ingredient = mongoose.model("ingredient")

router.get("/", function(req, res) {
    Ingredient.find({}).select("name")
    .exec((err, ingredients) => {
        if (err) res.status(500).json(err);
        else res.send(ingredients);
    });
});
router.get("/:id", function(req, res) {
    Ingredient.findById(req.params.id)
    .exec((err, ingredients) => {
        if (err) res.status(500).json(err);
        else res.json(ingredients);
    });
});

module.exports = router;