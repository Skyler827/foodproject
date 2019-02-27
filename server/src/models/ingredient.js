let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;
let Mixed      = mongoose.Schema.Types.Mixed;
let ingredient = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    bulkCostUnit: {
        type: String,
        required: true
    },
    units: {
        type: Mixed,
        required: true 
    },
    bulkCost: {
        type: Number,
        required: true
    }
});

mongoose.model("ingredient", ingredient);