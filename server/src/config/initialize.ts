import { readFileSync, readdirSync, readdir, readFile } from "fs";
import { join } from "path";
import { getManager, getConnection } from "typeorm";
import { initializeLogger as logger } from "../config/loggerConfig";
import { menuItem } from "../def/menuItem";
import { itemIngredient } from "../def/itemIngredient";
import { entities, entityName } from "../def/entityName";
import { camelCaseToSnakeCase } from "../def/util";
import { Category } from "../entities/category";
import { Ingredient } from "../entities/ingredient";
import { ItemOrder } from "../entities/item_order";
import { Item } from "../entities/item";
import { OptionMenu } from "../entities/option_menu";
import { Option } from "../entities/option";
import { Order } from "../entities/order";
import { Seat } from "../entities/seat";
import { Table } from "../entities/table";
import { User, UserType} from  "../entities/user";
import { KitchenOrder } from "../entities/kitchen_order";
import { OptionOrder } from "../entities/option_order";
import { Unit } from "../entities/unit";
import { ItemIngredientAmount } from "../entities/item_ingredient_amount";
import { OptionIngredientAmount } from "../entities/option_ingredient_amount";


export async function initialize() {
    try {
        await truncateEverything();
        await createFirstUser();
        await createIngredients();
        await initializeOptions();
        await initializeMenuItemsAndCategories();
        await enterInitialOrder();
        logger.info("Database initialization complete");
    } catch (err) {
        logger.warn(err);
    }
    return Promise.resolve();
}
async function truncateEverything() {
    const m = getManager();
    logger.info("Truncating data...");
    return entities.reduce((prev: Promise<any>, curr: entityName) =>
        prev.then(() =>
            m.query(`TRUNCATE public.${camelCaseToSnakeCase(curr)} CASCADE`))
    , Promise.resolve());
}
async function createFirstUser(): Promise<User> {
    return User.userFactory('skyler', 'skyler', UserType.Server).save();
}
async function createIngredients() {
    logger.info("creating ingredients...");    
    type ingredientFileData = {
        id: string,
        bulkCostCents: number,
        bulkUnit: string;
        units: {[unitname: string]: number}[]
    }[];
    const ingredientsDir = join(__dirname, "..", "..", "data", "ingredients");
    const ingredientFiles: string[] = await new Promise((resolve, reject) =>
        readdir(ingredientsDir, (err, files)=> err? reject(err) : resolve(files)));
    return Promise.all(ingredientFiles.map(f => new Promise(async (resolve, reject) => {
        const fullFileName = join(ingredientsDir, f);
        const ingredientsData: ingredientFileData = 
        JSON.parse(await new Promise((resolve2, reject2) =>
        readFile(fullFileName,{encoding:'utf8'},(err, data)=>err?reject2(err):resolve2(data))));
        Promise.all(ingredientsData.map(jsonI => new Promise((resolve3, reject3) => {
            const dbI = new Ingredient();
            dbI.name = jsonI.id;
            dbI.bulkUnitCostCents = jsonI.bulkCostCents;
            Ingredient.insert(dbI).then(resolve3).catch(reject3);
        }).then(() => new Promise(async (resolve3, reject3) => {
            const dbI = await Ingredient.findOneOrFail({where: [{name: jsonI.id}]});
            const handleUnits = (unitName: string): Promise<Unit> => new Promise(async (resolve4, reject4)=> {
                const u = new Unit();
                u.name = unitName;
                u.magnitude = jsonI.units[unitName];
                u.ingredient = dbI;
                logger.info("saving unit:");
                logger.info(JSON.stringify(u.toJson()));
                if (dbI.id == null) {
                    logger.error(`id for dbI: ${dbI.name}  is null!!`, new Error("crap"));
                    process.exit(1);
                }
                await u.save().catch(reject4);
                resolve4(u);
            });
            const units = await Promise.all(Object.keys(jsonI.units).map(handleUnits));
            dbI.bulkUnit = units.filter(u=> u.name == jsonI.bulkUnit)[0];
            await dbI.save().catch((err) => {
                logger.error("error saving "+JSON.stringify(dbI.name), err);
                reject3();
            });
            resolve3();
        })))).then(() => {
            logger.info(`${f} complete!`);
            resolve();
        })
    }))).then(()=>{
        logger.info("all ingredients saved!");
    });
}

async function initializeOptions() {
    type IngredientRecord = { "name":string,"quantity": number,"unit": string };
    type MenuOptions = {
        "min_options": number,
        "free_options": number,
        "max_options": number,
        "options": {
            "name": string,
            "priceCents": number,
            "ingredients": IngredientRecord[]
        }[]
    };
    
    logger.info("Initializing options...");
    const optionsDirectory = join(__dirname,"..","..","data","menu_options");
    const menu_filenames = readdirSync(optionsDirectory);
    return await Promise.all(menu_filenames.map(option_filename => new Promise(async (resolve, reject) => {
        const fullFileName = join(optionsDirectory, option_filename);
        const om = new OptionMenu();
        om.name = option_filename.substring(0, option_filename.length-5);
        const menuData: MenuOptions = await new Promise((resolve2, reject2) => {
            readFile(fullFileName, (err, data) =>
                err? reject2(err) : resolve2(data));
        }).then(JSON.parse)
        .catch(reject);
        await OptionMenu.insert(om);
        Promise.all(menuData.options.map(async jsonOption => {
            const dbOption = new Option();
            dbOption.name = jsonOption.name;
            dbOption.priceCents = jsonOption.priceCents;
            dbOption.menu = om;
            await dbOption.save();
            await Promise.all(jsonOption.ingredients.map(ingredientRecord => new Promise(async (resolve3, reject3) => {
                const oia = new OptionIngredientAmount();
                const ingredient = await Ingredient.findOneOrFail({where: {name:ingredientRecord.name}})
                .catch(reject3);
                const unit = await Unit.findOneOrFail({where: {name: ingredientRecord.unit, ingredient: ingredient}})
                .catch(reject3);
                if (!ingredient || !unit) return;
                oia.ingredient = ingredient;
                oia.option = dbOption;
                oia.quantity = ingredientRecord.quantity * unit.magnitude;
                await oia.save();
                resolve3();
            })));
            return dbOption.save();
        })).then(resolve).catch(reject);
    }))).then(() => logger.info("options initialized"))
    .catch(err => logger.warn(err));
}
async function initializeMenuItemsAndCategories(): Promise<void> {
    logger.info("Initializing Menu Items and Categories");
    const menuItemsDir = join(__dirname, "..", "..", "data", "menu_items");
    const files = readdirSync(menuItemsDir);
    return Promise.all(files.map(f => new Promise(async (resolve, reject) => {
        const fullFileName = join(menuItemsDir, f);
        const items: menuItem[] = JSON.parse(readFileSync(fullFileName, { encoding: 'utf8' }));
        const c = new Category();
        c.name = f.slice(0, f.length - 5);
        await c.save();
        Promise.all(items.map(jsonItem => new Promise(async (resolve2, reject2) => {
            const dbItem = new Item();
            dbItem.name = jsonItem.name;
            dbItem.priceCents = jsonItem.priceCents;
            dbItem.category = c;
            await dbItem.save();
            const handleIngredient = async (prev: Promise<any>, jsonIngredient: itemIngredient): Promise<any> => {
                const dbIngredient = await Ingredient.findOneOrFail({where: [{name: jsonIngredient.name}]}).catch(reject);
                if (!dbIngredient) return Promise.reject();
                const unit = await Unit.findOneOrFail({where: {name: jsonIngredient.unit, ingredient: dbIngredient}});
                const amount = jsonIngredient.quantity * unit.magnitude;
                const ingredientAmount = new ItemIngredientAmount();
                ingredientAmount.item = dbItem;
                ingredientAmount.ingredient = dbIngredient;
                ingredientAmount.quantity = amount;
                return prev.then(() => ingredientAmount.save());
            };
            await jsonItem.ingredients.reduce(handleIngredient, Promise.resolve())
            .catch(err => reject2(err))
            .then(() => resolve2());
            const options = await Promise.all(jsonItem.options.map(async optionName =>
                await OptionMenu.findOneOrFail({where: {name: optionName}})))
            .catch(err => reject2("invalid option menu names in "+jsonItem.name));
            if (options) dbItem.options = options;
            await dbItem.save();
        }))).then(()=>{
            logger.info("saved items from "+f);
            resolve();
        }).catch(err => reject(err));
    }))).then(()=>{
        logger.info("initializeMenuItemsAndCategories() complete");
    }).catch(e_1 => {
        logger.warn(e_1);
    });
}
async function enterInitialOrder() {
    logger.info("entering initial order");
    const t = new Table();
    const o = new Order();
    const s = new Seat();
    t.number = 241;
    await t.save();
    o.table = t;
    o.open = true;
    await o.save();
    s.seatNumber = 1;
    s.order = o;
    s.table = t;
    await s.save();

    const ko = new KitchenOrder();
    logger.info("about to save initial kitchen order");
    await ko.save();
    logger.info("initial kitchen order save complete");

    const itemNames = ["Small Wings", "ANGRY ORCHARD", "Sd Cheese Curds"];
    await Promise.all(itemNames.map(async itemName => {
        const item = await Item.findOneOrFail({where: [{name: itemName}], relations: ["category","options"]});
        const io = new ItemOrder();
        if (item.name == "SMALL WINGS") {
            for (let optionName in ["Seperate Boats", "CC"]) {
                const option = await Option.findOneOrFail({where: [{name: "Seperate Boats"}]});
                const opOrd = new OptionOrder();
                opOrd.itemOrder = io;
                opOrd.option = option;
                if (optionName == "CC" ) opOrd.quantity = 2;
                logger.info("about to save "+optionName+"...");
                await opOrd.save();
            }
        }
        io.item = item;
        io.kitchenOrder = ko;
        io.seat = s;
        logger.info("about to save item order " + itemName);
        return io.save();
    }));
    logger.info("initial order successfully entered!");
}
