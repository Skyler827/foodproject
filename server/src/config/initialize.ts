import { readFileSync, readdirSync, readdir } from "fs";
import { join } from "path";
import { getManager, EntityManager, getConnection, getRepository, Repository} from "typeorm";

import { menuItem } from "./menuItem";
import { User, UserType} from  "../entities/user";
import { Item } from "../entities/item";
import { Category } from "../entities/category";
import { Option } from "../entities/option";

type repoType = {
    'user': Repository<User>,
    'category': Repository<Category>,
    'item': Repository<Item>,
    'option': Repository<Option>
};
export async function initialize() {
    const repositories: repoType = {
        'user': getRepository(User),
        'category': getRepository(Category),
        'item': getRepository(Item),
        'option': getRepository(Option)
    }
    await dropEverything(repositories);
    await createFirstUser(repositories.user);
    await initializeMenuItemsAndCategories(repositories);
    await initializeOptions(repositories);
    return Promise.resolve();
}
async function dropEverything(repos: repoType) {
    console.log("1");
    let m = getManager();
    console.log("2");
    // order of items to delete
    // ie: delete the entities with nothing refering to them first
    let entities = [["item_"],["item", "user"], ["category"]];
    console.log(Category.name);
    entities.reduce((prevPromise:Promise<any>, entitySubList:string[]) => 
        prevPromise.then(() => 
            Promise.all(entitySubList.map(entity=>
                m.query(`DELETE FROM public.${entity}`)
            ))    
        )
    ,Promise.resolve());
}
async function createFirstUser(r: Repository<User>) {
    const u: User = User.userFactory('skyler', 'skyler', UserType.Server);
    r.create(u);
}
async function initializeMenuItemsAndCategories(repos: repoType) {
    const categoryRepo = repos.category;
    const itemRepo = repos.item;
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
async function initializeOptions(repo: repoType) {

}
