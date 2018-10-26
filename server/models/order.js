let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;
let ForeignKey = Schema.Types.ObjectId;

let order = new Schema({
    table:{
        type: ForeignKey,
        ref: 'table',
        required: true
    },
    itemids:{
        type: [ForeignKey],
        ref: 'item',
        required: true
    }
})

mongoose.model("order", order);