import { objectId } from './objectId';

export class Order {
    items:Array<{
        item_id: objectId,
        seat: number,
        option_line: string,
        options: {},
        ingredientMods: {
            ingredient_id: objectId,
            modification: string,
            before: boolean,
        }
    }> = [];
}