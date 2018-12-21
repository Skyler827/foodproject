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
            let category_names_to_ids = {};
            for (let i=0; i<created_categories.length; i++) {
                category_names_to_ids[created_categories[i].name] = created_categories[i]._id;
            }
            if (err) reject(err);
            else resolve(category_names_to_ids);
        })
    );
}
async function create_menu_items(filenames, directory, cat_names_to_ids) {
    return Promise.all(filenames.map(filename =>
        new Promise((resolve, reject) => 
            fs.readFile(path.join(directory,filename), (err, data) => {
                if (err) reject(err);
                else resolve({"data":JSON.parse(data),"filename":filename});
            })
        )
    )).then(objects=> 
        objects.reduce((prev_items,curr_items_obj,_,_)=>{
            for (let i=0; i<curr_items_obj.data.length; i++) {
                curr_items_obj.data[i].category = cat_names_to_ids[curr_items_obj.filenames.slice(0,-5)]
            }
            prev_items.concat(curr_items_obj.data);
        },[])
    ).then(
        itemList=>{
            Promise.all(
                itemList.map(i => {
                    console.log(i);
                    Item.create(i);
                })
            )
        }
    );
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
    return Promise.all(ingredients_list.map(ingredient => {
        Ingredient.create(ingredient)
    }));
}

async function main() {
    await drop_everything();
    const menu_item_dir = path.resolve("data","menu_items")
    const menu_item_filenames = fs.readdirSync(menu_item_dir);
    const categories_name_to_id = await create_categories(menu_item_filenames);
    await db_save_ingredients();
    await create_menu_items(menu_item_filenames, menu_item_dir, categories_name_to_id);

}
module.exports = main;