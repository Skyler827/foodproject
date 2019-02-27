/**
 * This file populates the restaraunt database with food/drink/ingredient/menu data in the supplied JSON files
 */

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const util = require('./util');

const Category = mongoose.model("category");
const Ingredient = mongoose.model("ingredient");
const ItemOrder = mongoose.model("item_order");
const Item = mongoose.model("item");
const Option_Menu = mongoose.model("option_menu");
const Option_Item = mongoose.model("option");
const Order = mongoose.model("order");
const Payment = mongoose.model("payment");
const Seat = mongoose.model("seat");
const User = mongoose.model("user");

const all_models = [
    Category, Item, Ingredient, ItemOrder, Option_Menu, Option_Item, Order, Payment,
    Seat, User
];
// initially has enough ingredients to make this many of all the items on the menu 
const initial_supply_factor = 3;

async function drop_everything() {
    process.stdout.write("dropping database...")
    return Promise.all(all_models.map(model=>
        new Promise((resolve, reject) => 
            model.deleteMany({},err => {
                if (err) reject(err)
                else {
                    process.stdout.write(".");
                    resolve()
                }
            })
        )
    )).then(()=>{
        console.log("done.")
        // process.stdout.write("done.");
        // console.log("");
    });
}

async function create_categories(filenames) {
    process.stdout.write("creating categories...");
    const category_objects = filenames.map((s) => ({"name":s.slice(0,-5)}));
    return new Promise((resolve, reject) =>
        Category.create(category_objects, (err, created_categories) => {
            let category_names_to_ids = {};
            for (let i=0; i<created_categories.length; i++) {
                category_names_to_ids[created_categories[i].name] = created_categories[i]._id;
            }
            if (err) reject(err);
            else {
                resolve(category_names_to_ids);
                process.stdout.write(".");
            }
        })
    ).then((data)=>{
        console.log("done.");
        return data;
    });
}

async function db_save_ingredients() {
    process.stdout.write("reading ingredient data...");
    const ingredients_path = path.resolve("data","ingredients");
    const ingredient_filenames = fs.readdirSync(ingredients_path);
    const ingredients_list = await Promise.all(
        ingredient_filenames.map(
            filename=>new Promise((resolve, reject)=> {
                const full_filename = path.join(ingredients_path, filename);
                fs.readFile(full_filename,{"encoding":"utf-8"},(err, data)=>{
                    const parsedData = JSON.parse(data);
                    if (err) reject(err);
                    else {
                        process.stdout.write(".");
                        resolve(parsedData);
                    }
                });
            })
        )
    ).then(util.flatten).then((data)=>{
        console.log("done");
        return data;
    })
    process.stdout.write("saving ingredient data...");
    return Promise.all(ingredients_list.map(ingredient => {
        Ingredient.create(ingredient);
    })).then(()=>{
        console.log("done.")
    });
}

async function create_option_menus_and_items() {
    process.stdout.write("saving option menus and items...")
    const menu_options_dir = path.resolve("data","menu_options");
    const menu_options_filenames = fs.readdirSync(menu_options_dir);
    return Promise.all(menu_options_filenames.map(filename=>
        new Promise((resolve, reject)=>
            fs.readFile(
                path.join(menu_options_dir,filename),{encoding:'utf-8'},
                (err,fileData) => {
                    let data = JSON.parse(fileData);
                    data.name = filename.slice(0,-5);
                    if (err) reject(err);
                    else resolve(data);
                }
            )
        )
    )).then(option_lists =>
        Promise.all(option_lists.map(option_menu =>
            Option_Menu.create(option_menu).then((new_menu)=>{
                // console.log(option_menu.name+":");
                // console.log(option_menu.options);
                return Promise.all(option_menu.options.map(async option_item=>{
                    option_item.menu = new_menu._id;
                    if (!option_item.ingredients) {
                        console.log("option_item.ingredients === null!!!");
                        console.log("for option \""+JSON.stringify(option_item)+"\"");
                        console.log("exiting now");
                        process.exit(1);
                    }
                    let new_ingredients = await Promise.all(
                        option_item.ingredients.map(ingredient=>
                            new Promise((resolve, reject)=>{
                                Ingredient.findOne({name:ingredient.name},(err, ingredient_record)=>{
                                    if (err) reject(err);
                                    else if (ingredient_record == null){
                                        console.log("Error while reading "+
                                        path.join("server","data","menu_options", option_menu.name+".json")+": "+option_item.name);
                                        reject("no such ingredient found: \""+ingredient.name+"\".");
                                    } else {
                                        ingredient.id = ingredient_record._id;
                                        // console.log("processing ingredient: "+ingredient.name);
                                        delete ingredient.name;
                                        resolve(ingredient);
                                    }
                                });
                            })
                        )
                    );
                    // console.log("new ingredients for "+option_item.name);
                    // console.log(new_ingredients);
                    option_item.ingredients = new_ingredients;
                    return Option_Item.create(option_item).then((result)=>{
                        // console.log("created option: "+option_item.name)
                        return result;
                    }).catch((err)=>{
                        console.log("error on option: "+option_item.name);
                        console.log(JSON.stringify(option_item))
                        console.error(err);
                        return err;
                    });
                }));
            })
        ))
    ).then((_)=>{
        console.log("done.");
        return _;
    });
}

async function create_menu_items(filenames, directory, cat_names_to_ids) {
    process.stdout.write("creating menu items...");
    return Promise.all(filenames.map(filename =>
        new Promise((resolve, reject) => 
            fs.readFile(path.join(directory,filename), (err, data) => {
                if (err) reject(err);
                else resolve({"data":JSON.parse(data),"filename":filename});
            })
        )
    )).then(objects =>
        objects.reduce((prev_items,curr_items_obj)=>{
            for (let i=0; i<curr_items_obj.data.length; i++) {
                curr_items_obj.data[i].category = cat_names_to_ids[curr_items_obj.filename.slice(0,-5)]
            }
            return prev_items.concat(curr_items_obj.data);
        },[])
    ).then(itemList =>
        Promise.all(itemList.map(async item => {
            if (item.ingredients == null) {
                console.log("item.ingredients == null!");
                console.log(item);
            }
            return Promise.all(
                item.ingredients.map(async ingredient=>
                    new Promise((resolve, reject)=>
                        Ingredient.findOne({name:ingredient.name},(err,ingredientRecord)=>{
                            if (err) reject(err);
                            else if (ingredientRecord == null) {
                                console.error("while filling out item \""+item.name+"\",");
                                console.error("no ingredient record found for \""+ingredient.name+"\".");
                                console.error("add an entry in your ingredients files!");
                                // reject(error_message);
                                process.exit(1);
                            }
                            else {
                                delete ingredient._id;
                                ingredient.name = ingredientRecord.name;
                                ingredient.id = ingredientRecord._id;
                                resolve(ingredient);
                            }
                        })
                    )
                )
            ).then(async updatedIngredients => {
                item.ingredients = updatedIngredients;
                if (item.options == null) {
                    console.log("Item \""+item.name+"\" missing property \"options\"!");
                }
                else if (item.options.map == null) {
                    console.log("something's weird:");
                    console.log(item);
                }
                else return Promise.all(item.options.map(option_name=>
                    new Promise((resolve, reject)=>
                        Option_Menu.findOne({name:option_name}, (err,record)=>{
                            if (err) reject(err);
                            else if (record == null) {
                                console.log("Could not find an option listing by the name of \""+option_name+"\"!");
                                process.exit(1);
                            } 
                            else resolve(record._id);
                        })
                    )
                )).then(option_menu_ids=>
                    item.options = option_menu_ids
                )
            }).then(_=> item);
        }))
    ).then(async preparedItems => {
        // console.log("-".repeat(20));
        // console.log(preparedItems.length+" Items inserted");
        // console.log("-".repeat(20));
        return Item.insertMany(preparedItems);
    }).then((_)=>{
        console.log("done");
    });
}
async function generate_default_user() {
    return User.create({
        username:'skyler',
        password: 'skyler',
        userType: "server"
    });
}
async function getItemByName(itemName) {
    return new Promise((resolve, reject)=>{
        Item.findOne({name:itemName}, (err, obj)=>{
            if (err) reject(err);
            else resolve(obj);
        });
    });
}
async function insert_test_order() {
    new Promise((resolve, reject)=> {
        User.findOne({username:'skyler'}, (err, user)=>{
            if (err) reject(err);
            else resolve(user);
        });
    }).then(user=>
        Order.create({
            server:user._id,
            tableNumber: 241,
            orderNumber: 1,
            open: true,
            openTime: new Date()
        })
    ).then(order=>
        Seat.create({
            seatNumber:1,
            order:order._id
        })
    ).then(async seat=> {
        let itemNames = [
            "Trad Sampler",
            "ANGRY ORCHARD",
            "Small Wings"
        ];
        return Promise.all(itemNames.map(async name=>{
            item_obj = await getItemByName(name);
            ItemOrder.create({
                item: item_obj._id,
                seat: seat._id,
                options: name == "Small Wings" ? [{
                        "option_menu_name":"wing_sides",
                        "option_item_name":"CC"
                    }, {
                        "option_menu_name":"wing_sides",
                        "option_item_name":"CC"} 
                ] : [],
                ingredient_modifiers: [],
                basePriceCents: item_obj.priceCents,
                totalPriceCents: item_obj.priceCents
            })
        }));
    });
}

async function main(cb) {
    await drop_everything();
    const menu_item_dir = path.resolve("data","menu_items")
    const menu_item_filenames = fs.readdirSync(menu_item_dir);
    const categories_name_to_id = await create_categories(menu_item_filenames);
    await db_save_ingredients();
    await create_option_menus_and_items();
    await create_menu_items(menu_item_filenames, menu_item_dir, categories_name_to_id);
    await generate_default_user();
    await insert_test_order();
    console.log("food app is ready to serve!")
    cb();
}

module.exports = main;