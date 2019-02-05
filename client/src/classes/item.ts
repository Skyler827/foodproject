import { objectId } from './objectId';
export class Item {
    id: objectId;
    name: string;
    priceCents: number;
    ingredients: Array<objectId>;
    options: Array<objectId>;
}