let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;

let ingredient = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity_base_units: {
        type: String,
        required: true
    },
    base_unit_name: {
        type: String,
        required: true
    },
    units: [{
        unit_name: {
            type:String,
            required: true
        },
        unit_size: {
            type:Number,
            required: true
        }
    }],
    unit_price: {
        type: Number,
        required: true
    }
});

mongoose.model("ingredient", ingredient);