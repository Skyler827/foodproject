let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;
let ForeignKey = Schema.Types.ObjectId;

let item_order = new Schema({
    item: {
        type: ForeignKey,
        ref: 'item',
        required: true
    },
    seat: {
        type: ForeignKey,
        ref: 'seat',
        required: true
    },
    option_line: {
        type: String,
        required: false,
        maxlength: 32
    },
    options: [{
        option_menu_name: {
            type:String,
            required: true
        },
        option_item_name: {
            type: String,
            required: true
        },
        optionPriceCents: {
            type: Number,
            required: false
        }
    }],
    ingredient_modifiers: [{
        ingredientName: {
            type: String,
            required: true,
        },
        ingredient_id: {
            type: ForeignKey,
            ref: 'ingredient',
            required: true
        },
        modification: {
            type: String,
            required: true
        },
        before: {
            type: Boolean,
            required: false
        }
    }],
    basePriceCents: {
        type: Number,
        required: false
    },
    totalPriceCents: {
        type: Number,
        required: false
    }
});

mongoose.model("item_order", item_order);