export type OneItemOrder = {
    id: number,
    item: number
    itemName: string,
    seat: number,
    option_line: string,
    basePriceCents: number,
    totalPriceCents: number,
    options: Array<{}>,
    ingredient_modifiers: Array<{}>,
    selected: boolean
};
export type AllItemOrder = Array<Array<OneItemOrder>>;