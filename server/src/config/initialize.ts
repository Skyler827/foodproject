import { getManager, EntityManager, getConnection, getRepository} from "typeorm";
import { User, UserType} from  "../entities/user";
import { readFileSync, readdirSync, readdir } from "fs";
import { join } from "path";
import { Item } from "../entities/item";
import { Category } from "../entities/category";
import { menuItem } from "./menuItem";

export async function initialize() {
    await createFirstUser();
    await initializeMenuItemsAndCategories();
    await initializeOptions();
    return Promise.resolve();
    
}
async function createFirstUser() {
    const manager: EntityManager = getManager()
    const users:User[] = await manager.find(User);
    users.forEach(u => manager.delete(User, u.id));
    const u: User = User.userFactory('skyler', 'skyler', UserType.Server);
    manager.save(u);
}
async function initializeMenuItemsAndCategories() {
    const connection = getConnection();
    const categoryRepo = getRepository(Category);
    const itemRepo = getRepository(Item);
    const menuItemsDir = join(__dirname, "..", "..", "data", "menu_items");
    const files = readdirSync(menuItemsDir);
    return await Promise.all(files.map(f => new Promise(async (resolve, reject) => {
        const fullFileName = join(menuItemsDir, f);
        const items: menuItem[] = JSON.parse(readFileSync(fullFileName, { encoding: 'utf8' }));
        const c = new Category();
        c.name = f.slice(0, f.length - 5);
        await categoryRepo.insert(c);
        try {
            Promise.all(items.map(item => new Promise(async (resolve2, reject2) => {
                try {
                    const i = Item.factory(item, c);
                    await itemRepo.insert(i);
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
async function initializeOptions() {}
