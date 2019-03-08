import { readFileSync, readdirSync, readdir, readFile } from "fs";
import { join } from "path";
import { getManager, EntityManager, getConnection, getRepository, Repository, BaseEntity} from "typeorm";
import { initializeLogger as logger } from "../config/loggerConfig";
import { menuItem } from "../def/menuItem";
import { entityName, entities } from "../def/entityName";
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
import { json } from "body-parser";
import { isNullOrUndefined } from "util";


export async function initialize() {
    try {
        await dropEverything();
        await createFirstUser();
        await createIngredients();
        await initializeMenuItemsAndCategories();
        await initializeOptions();
        await enterInitialOrder();
    } catch (err) {
        logger.warn(err);
    }
    return Promise.resolve();
}
async function dropEverything() {
    let m = getManager();
    logger.info("Dropping data...");
    return Promise.all(entities.map(entity =>
        m.query(`TRUNCATE public.${camelCaseToSnakeCase(entity)} CASCADE`)))
        .then(()=>logger.info("previous data dropped"));
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
    const ingredientFiles:string[] = await new Promise((resolve, reject) =>
        readdir(ingredientsDir, (err, files)=> err? reject(err) : resolve(files)));
    return Promise.all(ingredientFiles.map(f => new Promise(async (resolve, reject) => {
        const fullFileName = join(ingredientsDir, f);
        const ingredientsData: ingredientFileData = 
        JSON.parse(await new Promise((resolve2, reject2)=>
        readFile(fullFileName,{encoding:'utf8'},(err, data)=>err?reject2(err):resolve2(data))));
        Promise.all(ingredientsData.map(jsonI => new Promise((resolve3, reject3) => {
            const dbI = new Ingredient();
            dbI.name = jsonI.id;
            dbI.bulkUnitCostCents = jsonI.bulkCostCents;
            Ingredient.insert(dbI).then(resolve3).catch(reject3);
        }).then(() => new Promise(async (resolve3, reject3) => {
            const dbI = await Ingredient.findOneOrFail({where:[{name:jsonI.id}]});
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
            dbI.units = units;
            dbI.bulkUnit = units.filter(u=> u.name == jsonI.bulkUnit)[0];
            await dbI.save().catch((err) => {
                logger.error("error saving "+JSON.stringify(dbI.name), err);
                reject3();
            });
            resolve3();
        })).then(() => {
            logger.info(`${f} complete!`);
            resolve();
        })
        ))
    }))).then(()=>{
        logger.info("all ingredients saved!");
    });
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
        try {
            Promise.all(items.map(item => new Promise(async (resolve2, reject2) => {
                try {
                    const i = Item.factory(item, c);
                    await i.save();
                    resolve2();
                }
                catch (e) {
                    reject2(e);
                }
            }))).then(()=>{
                logger.info("saved items from "+f);
                resolve();
            });
        }
        catch (reason) {
            reject(reason);
        }
    }))).then(()=>{
        logger.info("initializeMenuItemsAndCategories() complete");
    }).catch(e_1 => {
        logger.info("\n");
        logger.warn(e_1);
    });
}
async function initializeOptions() {
    type menu_options = {
        "min_options":number,
        "free_options":number,
        "max_options":number,
        "options": {
            "name":string,
            "priceCents":number,
            "ingredients": {
                "name":string,
                "quantity": number,
                "unit":string
            }[]
        }[]
    };
    
    logger.info("Initializing options...");
    const optionsDirectory = join(__dirname,"..","..","data","menu_options");
    const menu_filenames = readdirSync(optionsDirectory);
    return await Promise.all(menu_filenames.map(option_filename => new Promise(async (resolve, reject)=>{
        const fullFileName = join(optionsDirectory, option_filename);
        const om = new OptionMenu();
        om.name = option_filename.substring(0, option_filename.length-5);
        const menuData: menu_options = await new Promise((resolve2, reject2) =>{
            readFile(fullFileName,(err, data) => 
                err? reject2(err) : resolve2(data));
        }).then(JSON.parse)
        .catch(reject);
        await OptionMenu.insert(om);
        Promise.all(menuData.options.map(fileRecord => {
            const dbRecord = new Option();
            dbRecord.name = fileRecord.name;
            dbRecord.priceCents = fileRecord.priceCents;
            dbRecord.menu = om;
            return dbRecord.save();
        })).then(resolve).catch(reject);
    }))).then(()=>logger.info("options initialized"))
    .catch(err => logger.warn(err));
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
        logger.info("about to save item order "+itemName);
        return io.save();
    }));
    logger.info("initial order successfully entered!");
}
