import { readFileSync, readdirSync, readdir, readFile } from "fs";
import { join } from "path";
import { getManager, EntityManager, getConnection, getRepository, Repository, BaseEntity} from "typeorm";

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
import { User, UserType} from  "../entities/user";

type repoMap = {
    'user': Repository<User>,
    'category': Repository<Category>,
    'item': Repository<Item>,
    'option': Repository<Option>
};

export async function initialize() {
    const repositories: repoMap = {
        'user': getRepository(User),
        'category': getRepository(Category),
        'item': getRepository(Item),
        'option': getRepository(Option)
    }
    await dropEverything();
    await createFirstUser(repositories.user);
    await initializeMenuItemsAndCategories(repositories);
    await initializeOptions(repositories);
    try {
        await enterInitialOrder();
    } catch (err) {
        console.log("error with enterInitialOrder(), skipping...");
    }
    return Promise.resolve();
}
async function dropEverything() {
    let m = getManager();
    Promise.all(entities.map(entity =>
        m.query(`TRUNCATE public.${camelCaseToSnakeCase(entity)} CASCADE`)));
}
async function createFirstUser(r: Repository<User>) {
    const u: User = User.userFactory('skyler', 'skyler', UserType.Server);
    return r.insert(u);
}
async function initializeMenuItemsAndCategories(repos: repoMap) {
    const menuItemsDir = join(__dirname, "..", "..", "data", "menu_items");
    const files = readdirSync(menuItemsDir);
    return await Promise.all(files.map(f => new Promise(async (resolve, reject) => {
        const fullFileName = join(menuItemsDir, f);
        const items: menuItem[] = JSON.parse(readFileSync(fullFileName, { encoding: 'utf8' }));
        const c = new Category();
        c.name = f.slice(0, f.length - 5);
        await repos.category.insert(c);
        try {
            Promise.all(items.map(item => new Promise(async (resolve2, reject2) => {
                try {
                    const i = Item.factory(item, c);
                    await repos.item.insert(i);
                    resolve2();
                }
                catch (e) {
                    reject2(e);
                }
            }))).then(()=>resolve());
        }
        catch (reason) {
            reject(reason);
        }
    }))).then(()=>{
        console.log("completed succesfully");
    }).catch(e_1 => {
        console.error("error:");
        console.error(e_1);
    });
}
async function initializeOptions(repo: repoMap) {
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
            return Option.insert(dbRecord);
        })).then(resolve).catch(reject);
    })));
}
async function enterInitialOrder() {
    // I will enter an order:
    // small trad wings
    // spicy garlic and asain zing
    // seperate boats
    // two CC boats
    // an angry orchard
    // and a side of cheese curds
    const lookup = async (itemName:string, relationNames: string[]) => 
        await Item.findOneOrFail({where:[{name:itemName}], relations: relationNames});
    const smallWings = await lookup("Small Wings", []);
    const angryOrchard = await lookup("ANGRY ORCHARD", []);
    const cheeseCurds = await lookup("Sd Cheese Curds", []);

    const o = Order
}
