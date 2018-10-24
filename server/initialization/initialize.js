const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const Category = mongoose.model("category");
const Item = mongoose.model("item");

async function write_categories() {
    const categories_from_file = await new Promise((resolve, reject) => {
        fs.readFile("./categories.json", (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
    return Category.create(categories_from_file);
}
async function write_food() {

}
async function main() {
    const db_categories = await new Promise((resolve, reject) => {
        Category.find({}, function(err, data) {
            if (err) reject(err);
            else resolve(data);
        });
    });
    if (db_categories.length == 0) await write_categories();
    const db_food = await new Promise((resolve, reject) => {
        Item.find({}, function(err, data) {
            if (err) reject(err);
            else resolve(data);
        });
    });
    if (db_food.length == 0) await write_food();
}