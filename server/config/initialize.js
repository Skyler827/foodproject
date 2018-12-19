const fs = require("fs");
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
    return new Promise.all([Category, Ingredient, Item].map(model=>
        new Promise((resolve, reject) => 
            model.deleteMany({},err =>
                err? reject(err) : resolve()))
    ));
}
async function create_categories(filenames) {
    const category_objects = filenames.map((s) => ({"name":s.slice(0,-5)}));
    Category.create(category_objects, (err, created_categories) => {
        if (err) reject(err);
        else resolve(created_categories);
    });
}
async function create_menu_items(filenames) {
    return new Promise.all(filenames.map(filename =>
        new Promise((resolve, reject) => 
            fs.readFile(filename, (err,data) => {
                if (err) reject(err);
                else resolve(data);
            })
        )
    ));
}
async function db_save_ingredients(filenames) {
    //get data from files
    return new Promise.all(filenames.map(filename => 
        new Promise((resolve, reject) => 
            fs.readFile(filename,(err, data)=>{
                if (err) reject(err);
                else resolve(data);
            })
        )
    )).then(flatten)
    .then(items=>
        items.map(item=>item.ingredients))
    .then(flatten)
    .then(ingredients=>Promise.all(
        ingredients.map(ingredient=>
            new Promise((resolve, reject)=> {
                const conditions = {name:ingredient.name};
                const update = {
                    $setOnInsert: {
                        base_unit_name: ingredient.unit,
                        quantity_base_units: ingredient.quantity * initial_supply_factor,
                        units: [{
                            unit_name:ingredient.unit,
                            unit_size:1
                        }]
                    },
                    $inc: {
                        quantity_base_units: ingredient.quantity * initial_supply_factor
                    }
                };
                const options = {upsert:true};
                Item.findOneAndUpdate(conditions,update,options,(err,doc)=>{
                    if (err) reject(err);
                    else resolve(doc);
                });
            })
        ))
    );
}

async function main() {
    await drop_everything();
    const json_filenames = fs.readdirSync("./data/menu_items");
    create_categories(json_filenames);
    create_menu_items(json_filenames);

}
module.exports = main;