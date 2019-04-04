export interface FullTableRecord {
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

interface BaseOrder {
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
export interface OrderWithItem extends BaseOrder{
    seat: number;
    item: {
        id: number,
        name: string
    };
}
export interface OrderWithItemUI extends OrderWithItem {
    selected: boolean;
}

export interface OrderWithoutItem extends BaseOrder{
    seat: number;
    item: number;
}
export interface OutstandingOrder extends BaseOrder {
    seat: number;
    itemName: string
    item: number;
}
export class OutstandingOrderUI implements OutstandingOrder {
    seat: number;
    itemName: string;
    item: number;
    id: number;
    option_line: string;
    options: { id: number; option_menu_name: string; option_item_name: string; }[];
    ingredient_modifiers: { ingredient_id: number; modification: string; before: boolean; }[];
    basePriceCents: number;
    totalPriceCents: number;
    selected: boolean = false;
}
export interface NewOrderResponse {
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
