import { objectId } from './objectId';

class BaseOrder {
    _id: objectId;
    seat: objectId;
    option_line: string;
    options: Array<{
        _id: objectId,
        option_menu_name: string,
        option_item_name: string
    }>;
    ingredient_modifiers: {
        ingredient_id: objectId,
        modification: string,
        before: boolean,
    };
    basePriceCents: number;
    totalPriceCents: number;
}
export class OrderWithItem extends BaseOrder{
    item: {
        _id:objectId,
        name: string
    };
}

export class OrderWithoutItem extends BaseOrder{
    item: objectId;
}