let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;

let ingredient = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    quantity_unit: {
        type: String,
        required: true
    },
    unit_price: {
        type: Number,
        required: true
    }
});

mongoose.model("ingredient", ingredient);