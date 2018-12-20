const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Category = mongoose.model("category");
const Item = mongoose.model("item");
const Ingredient = mongoose.model("ingredient");

// initially has enough ingredients to make this many of all the items on the menu 
const initial_supply_factor = 3;


// borrowed from https://stackoverflow.com/a/15030117
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
          return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
/**
 * This file populates the restaraunt database with food/drink/ingredient/menu data in the supplied JSON files
 */
async function drop_everything() {
    return Promise.all([Category, Ingredient, Item].map(model=>
        new Promise((resolve, reject) => 
            model.deleteMany({},err =>
                err? reject(err) : resolve()
            )
        )
    ));
}
async function create_categories(filenames) {
    const category_objects = filenames.map((s) => ({"name":s.slice(0,-5)}));
    return new Promise((resolve, reject) =>
        Category.create(category_objects, (err, created_categories) => {
            if (err) reject(err);
            else resolve(created_categories);
        })
    );
}
async function create_menu_items(filenames, directory) {
    return Promise.all(filenames.map(filename =>
        new Promise((resolve, reject) => 
            fs.readFile(path.join(directory,filename), (err, data) => {
                if (err) reject(err);
                else resolve(JSON.parse(data));
            })
        )
    )).then(flatten)
    .then(itemList=>Promise.all(itemList.map(Item.create)));
}
async function db_save_ingredients() {
    const ingredients_path = path.posix.resolve("./data/ingredients");
    const ingredient_filenames = fs.readdirSync(ingredients_path);
    const ingredients_list = await Promise.all(
        ingredient_filenames.map(
            filename=>new Promise((resolve, reject)=> {
                const full_filename = path.join(ingredients_path, filename);
                fs.readFile(full_filename,{"encoding":"utf-8"},(err, data)=>{
                    const parsedData = JSON.parse(data);
                    if (err) reject(err);
                    else resolve(parsedData);
                });
            })
        )
    ).then(flatten);
    return Promise.all(ingredients_list.map(ingredient => 
        Ingredient.create(ingredient)
    ));
}

async function main() {
    const menu_item_dir = path.resolve("data","menu_items")
    const menu_item_filenames = fs.readdirSync(menu_item_dir);
    await drop_everything();
    create_categories(menu_item_filenames);
    await db_save_ingredients();
    create_menu_items(menu_item_filenames, menu_item_dir);

}
module.exports = main;