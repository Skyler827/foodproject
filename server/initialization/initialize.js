const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Category = mongoose.model("category");
const Item = mongoose.model("item");


Category.create()