export class MenuItem {
    _id: number;
    name: string;
    priceCents: number;
    ingredients: Array<{
        _id: number,
        id: number,
        name:string,
        quantity: number,
        unit: string
    }>;
    optionsMenus: Array<number>;
}

export type ItemType = {_id:String, name:String};
export type ItemList = Array<ItemType>
export type Ingredient = {
    _id: number,
    name: string,
    quantity: number,
    unit: String,
    id: number
};
export type FullMenuItemRecord = {
    options: Array<number>,
    _id: number,
    name: string,
    priceCents: number,
    ingredients: Array<Ingredient>,
    category: number,
    __v: number
};
