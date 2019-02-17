import { objectId } from './objectId';
export class MenuItem {
    _id: objectId;
    name: string;
    priceCents: number;
    ingredients: Array<{
        _id: objectId,
        id: objectId,
        name:string,
        quantity: number,
        unit: string
    }>;
    optionsMenus: Array<objectId>;
}

export type ItemType = {_id:String, name:String};
export type ItemList = Array<ItemType>
export type Ingredient = {
    _id: objectId,
    name: string,
    quantity: number,
    unit: String,
    id: objectId
};
export type FullMenuItemRecord = {
    options: Array<objectId>,
    _id: objectId,
    name: String,
    priceCents: number,
    ingredients: Array<Ingredient>,
    category: objectId,
    __v: number
};
