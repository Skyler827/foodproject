let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;
let ForeignKey = Schema.Types.ObjectId;

let item_order = new Schema({
    item: {
        type: ForeignKey,
        ref: 'item',
        required: true
    }
});

mongoose.model("item_order", item_order);