export class FullTableRecord {
    number: number;
    seats: Array<{
        id: number;
        seatNumber: number;
        itemOrders: Array<{
            id: number
            optionLine: string;
            orderTime: string;
            status: number;
            item: {
                id: number;
                name: string;
                priceCents: number;
            },
        }>;
    }>;
}

class BaseOrder {
    id: number;
    option_line: string;
    options: Array<{
        id: number,
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
        id: number,
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
export class NewOrderResponse {
    id: number;
    item: {
        id: number;
        name: string;
        priceCents: number;
    };
    kitchenOrder: {
        id: number;
        openTime: string;
    }
    optionLine: string;
    orderTime: string;
    seat: { id: number; seatNumber: number; };
    status: number;
}
