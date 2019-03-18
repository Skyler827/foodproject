type request_body = {
    "item_orders": Array<{
        "item_id": number,
        "seat": number,
        "option_line": String,
        "options": Map<number, Array<number>>,
        "ingredient_mods": Array<{
            "ingredient_id": number,
            "modification": String,
            "before": Boolean
        }>
    }>
};
