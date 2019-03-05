import { readFileSync, readdirSync, readdir } from "fs";
import { join } from "path";
import { getManager, EntityManager, getConnection, getRepository, Repository, BaseEntity} from "typeorm";

import { menuItem } from "../def/menuItem";
import { entityName, entities } from "../def/entityName";
import { camelCaseToSnakeCase } from "../def/util";
import { Category } from "../entities/category";
import { Ingredient } from "../entities/ingredient";
import { Item } from "../entities/item";
import { Option } from "../entities/option";
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
async function initializeOptions(repo: repoMap) {

}
