let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;
let ForeignKey = Schema.Types.ObjectId;

let item = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number, // integer number of cents
        required: true
    },
    category: {
        type: ForeignKey,
        refPath: 'category',
        required: true
    },
    ingredients: {
        type: [ForeignKey],
        ref: 'ingredients',
        required:true
    },
    options: {
        type: [ForeignKey],
        ref: 'option_menu',

    }
})

mongoose.model("item",item);