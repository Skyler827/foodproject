const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Category = mongoose.model("category");
const Ingredient = mongoose.model("ingredient");
const Item = mongoose.model("item");

const menu_items_dir = path.resolve("data","menu_items");

/**
 * This file populates the restaraunt database with food/drink/ingredient/menu data in the supplied JSON files
 */
async function handle_categories() {
    return new Promise((resolve, reject) => {
        Category.deleteMany({}, (err) => {
            if (err) reject(err);
            const categories = fs.readdirSync(menu_items_dir).map((s) => s.slice(0,-5)).map((s)=> ({"name":s}));
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
    return new Promise((resolve, reject)=>
        fs.readFile(path.join(menu_items_dir,json_filename),{encoding:'utf-8'},(err, data)=>{
            if (err) reject(err);
            else resolve(Promise.all(JSON.parse(data).map(handle_one_item)));
        })
    );
}
async function handle_one_item(item_obj) {
    return new Promise((resolve, reject) => {
        if (item_obj.hasOwnProperty('ingredients')) resolve();
        else {
            console.log("object \""+item_obj.name+"\" missing ingredients!");
            reject();
        }
    });
}

async function main() {
    await handle_categories();
    await handle_items();
}
module.exports = main;