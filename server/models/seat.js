let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;
let ForeignKey = Schema.Types.ObjectId;

let seat = new Schema({
    seatNumber:{
        type: Number,
        required: true
    },
    order: {
        type: ForeignKey,
        ref: 'order'
    }
})

mongoose.model("seat", seat);