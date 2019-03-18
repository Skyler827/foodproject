export class MenuItem {
    _id: number;
    name: string;
    priceCents: number;
    ingredients: Array<{
        id: number,
        name: string,
        quantity: number,
        unit: string
    }>;
    optionsMenus: Array<number>;
}

export type ItemType = {id: number, name: string};
export type ItemList = Array<ItemType>
export type IngredientAmount = {
    id: number,
    name: string,
    quantity: number
};
export type FullMenuItemRecord = {
    options: Array<number>,
    id: number,
    name: string,
    priceCents: number,
    ingredients: Array<IngredientAmount>,
    category: number,
};
