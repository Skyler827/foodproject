let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;
let ForeignKey = Schema.Types.ObjectId;

let order = new Schema({
    server: {
        type: ForeignKey,
        ref: 'user',
        required: true
    },
    tableNumber: {
        type: Number,
        required: true
    },
    orderNumber: {
        type: Number,
        required: true
    },
    open: {
        type: Boolean,
        required: true
    },
    openTime: {
        type: Date,
        required: true
    },
    closeTime: {
        type: Date,
        required: false
    }
})

mongoose.model("order", order);