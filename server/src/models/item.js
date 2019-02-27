let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;
let ForeignKey = Schema.Types.ObjectId;

let item = new Schema({
    name: {
        type: String,
        required: true
    },
    priceCents: {
        type: Number,
        required: true
    },
    category: {
        type: ForeignKey,
        refPath: 'category',
        required: true
    },
    ingredients: [{
        id: {
            type: ForeignKey,
            ref: 'ingredient',
            required: true
        },
        quantity: {
            type:Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }],
    options: {
        type: [ForeignKey],
        ref: 'option_menu',
        required: false

    }
})

mongoose.model("item",item);