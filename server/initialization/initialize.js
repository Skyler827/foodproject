const fs = require("fs");
const mongoose = require("mongoose");
async function write_categories() {
    const Category = mongoose.model("category");
    var categories = JSON.parse(fs.readFileSync("./initialization/categories.json", {"encoding":"utf-8"}))
    // console.log(categories);
    for (let i=0; i<categories.length; i++) {
        // console.log(categories[i]);
        Category.create(categories[i]);
    }
}
async function write_food() {
    console.log("hello world!");
}
async function main() {
    const Item = mongoose.model("item");
    const Category = mongoose.model("category");
    let db_categories = await new Promise((resolve, reject) => {
        Category.find({}, function(err, data) {
            if (err) reject(err);
            else resolve(data);
        });
    });
    if (db_categories.length == 0) await write_categories();
    let db_food = await new Promise((resolve, reject) => {
        Item.find({}, function(err, data) {
            if (err) reject(err);
            else resolve(data);
        });
    });
    if (db_food.length == 0) return await write_food();
    else return;
}
module.exports.main = main;