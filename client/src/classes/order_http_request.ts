import {objectId as ObjectId} from 'src/classes/objectId';
type request_body = {
    "item_orders": Array<{
        "item_id": ObjectId,
        "seat": number,
        "option_line": String,
        "options": Map<ObjectId, Array<ObjectId>>,
        "ingredient_mods": Array<{
            "ingredient_id": ObjectId,
            "modification": String,
            "before": Boolean
        }>
    }>
};
