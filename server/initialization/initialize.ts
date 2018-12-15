const fs = require("fs");
const mongoose = require("mongoose");

async function write_categories() {
    const Category = mongoose.model("category");

    fs.readFileSync("./categories.json", (err, data) => {
        if (err) return err;
        Category.create(data);
    });
}
async function write_food() {
    console.log("hello world!");
}
async function main() {
    const Item = mongoose.model("item");
    const Category = mongoose.model("category");
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
    if (db_food.length == 0) return await write_food();
    else return;
}
module.exports.main = main;