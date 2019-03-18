class BaseOrder {
    _id: number;
    option_line: string;
    options: Array<{
        _id: number,
        option_menu_name: string,
        option_item_name: string
    }>;
    ingredient_modifiers: Array<{
        ingredient_id: number,
        modification: string,
        before: boolean,
    }>;
    basePriceCents: number;
    totalPriceCents: number;
}
export class OrderWithItem extends BaseOrder{
    seat: number;
    item: {
        _id: number,
        name: string
    };
}
export class OrderWithItemUI extends OrderWithItem {
    selected: boolean;
}

export class OrderWithoutItem extends BaseOrder{
    seat: number;
    item: number;
}
export class OutstandingOrder extends BaseOrder {
    seat: number;
    itemName: string
    item: number;
}
export class OutstandingOrderUI extends OutstandingOrder {
    selected: boolean = false;
}