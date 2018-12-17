const fs = require("fs");
const mongoose = require("mongoose");
const Category = mongoose.model("category");
const Ingredient = mongoose.model("ingredient");
const Item = mongoose.model("item");

/**
 * This file populates the restaraunt database with food/drink/ingredient/menu data in the supplied JSON files
 */
async function handle_categories() {
    return new Promise((resolve, reject) => {
        Category.deleteMany({}, (err) => {
            if (err) reject(err);
            const categories = fs.readdirSync("./data/menu_items").map((s) => s.slice(0,-5)).map((s)=> ({"name":s}));
            Category.create(categories, (err, created_categories) => {
                if (err) reject(err);
                else resolve(created_categories);
            });
        });
    });
}

async function handle_items() {
    return new Promise((resolve, reject) => {
        Item.deleteMany({}, (err) => {
            if (err) reject(err);
            else resolve();
        });
    }).then(() => {
        const json_files = fs.readdirSync("./data/menu_items");
        return Promise.all(json_files.map(handle_json_file));
    });
}
async function handle_json_file(json_filename) {
    const data = fs.readFileSync(json_filename);
    return Promise.all(data.map(handle_one_item));
}
async function handle_one_item(item_obj) {
    return new Promise((resolve, reject) => {
        console.log(item_obj)
    });
}

async function main() {
    await handle_categories();
    await handle_items();
}
module.exports = main;