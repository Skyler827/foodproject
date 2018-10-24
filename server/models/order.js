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
        type: [String],
        required: true
        
    }
})

mongoose.model("order",order);