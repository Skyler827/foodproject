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


export async function initialize() {
    await dropEverything();
    await createFirstUser();
    await initializeMenuItemsAndCategories();
    await initializeOptions();
    try {
        await enterInitialOrder();
    } catch (err) {
        logger.warn(err);
        logger.warn("error with enterInitialOrder(), skipping...");
    }
    return Promise.resolve();
}
async function dropEverything() {
    let m = getManager();
    logger.info("Dropping data...");
    Promise.all(entities.map(entity =>
        m.query(`TRUNCATE public.${camelCaseToSnakeCase(entity)} CASCADE`)))
        .then(()=>logger.info("done\n"));
}
async function createFirstUser(): Promise<User> {
    return User.userFactory('skyler', 'skyler', UserType.Server).save();
}
async function initializeMenuItemsAndCategories(): Promise<void> {
    logger.info("Initializing Menu Items and Categories");
    const menuItemsDir = join(__dirname, "..", "..", "data", "menu_items");
    const files = readdirSync(menuItemsDir);
    return await Promise.all(files.map(f => new Promise(async (resolve, reject) => {
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
        logger.info("done");
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
    
    logger.info("Initializing options");
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
    }))).catch(err => logger.warn(err));
}
async function enterInitialOrder() {
    // I will enter an order:
    // small trad wings
    // spicy garlic and asain zing
    // seperate boats
    // two CC boats
    // an angry orchard
    // and a side of cheese curds
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
    await Promise.all(itemNames.map(async itemName=>{
        const i = await Item.findOneOrFail({where: [{name:itemName}], relations: ["category","options"]});
        const io = new ItemOrder();
        if (i.name == "SMALL WINGS") {
            for (let optionName in ["Seperate Boats", "CC"]) {
                const op = await Option.findOneOrFail({where: [{name: "Seperate Boats"}]});
                const opOrd = new OptionOrder();
                opOrd.itemOrder = io;
                opOrd.option = op;
                if (optionName == "CC" ) opOrd.quantity = 2;
                logger.info("about to save "+optionName+"...");
                await opOrd.save();
            }
        }
        io.item = i;
        io.kitchenOrder = ko;
        io.seat = s;
        logger.info("about to save item order "+itemName);
        return io.save();
    }));
    logger.info("initial order successfully entered!");
}
