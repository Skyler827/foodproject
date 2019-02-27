let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;
let ForeignKey = Schema.Types.ObjectId;

let seat = new Schema({
    seatNumber:{
        type: Number,
        required: true,
        validate: {
            validator: x => Number.isInteger(x) && x >= 0,
            message: 'Error seat value {VALUE}: must be a non negative integer'
        }
    },
    order: {
        type: ForeignKey,
        ref: 'order',
        required: true
    }
})

mongoose.model("seat", seat);