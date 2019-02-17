import { objectId } from "./objectId";

export class Category {
    _id: objectId;
    name: string;
}
export class CategoryWithSelected extends Category {
    selected: boolean;
}