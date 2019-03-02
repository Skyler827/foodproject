import { getManager, TransactionManager, EntityManager} from "typeorm";
import { User, UserType} from  "../entities/user";
import { readFileSync, readdirSync, readdir } from "fs";
import { join } from "path";
import { Item } from "../entities/item";
import { Category } from "../entities/category";

export type menuItem = {
    name: string;
    bulkCost: number;
    bulkCostUnit: string;
    units: {}
}
export async function initialize() {
    await initializeMenuItemsAndCategories();
    await initializeOptions();
}
async function createFirstUser() {
    const manager: EntityManager = getManager()
    const users:User[] = await manager.find(User);
    users.forEach(u => manager.delete(User, u.id));
    const u: User = User.userFactory('skyler', 'skyler', UserType.Server);
    manager.save(u);
}
async function initializeMenuItemsAndCategories() {
    const menuItemsDir = join(__dirname, "..", "..", "data", "menu_items");
    console.log(menuItemsDir);
    const files = readdirSync(menuItemsDir);
    return getManager().transaction(transactionManager => {
        return Promise.all(files.map(f=>new Promise((resolve, reject)=>{
            const items:menuItem[] = JSON.parse(readFileSync(f, {encoding: 'utf8'}));
            const category = new Category();
            category.name = f.slice(0, f.length-5);
            Promise.all(items.map(item=>new Promise((resolve, reject)=>{
                const i = Item.factory(item, category);
                transactionManager.create(Item, i);
                resolve();
            })))
        })));
    });
}
async function initializeOptions() {}
