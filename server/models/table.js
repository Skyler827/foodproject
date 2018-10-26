let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;
let ForeignKey = Schema.Types.ObjectId;

let table = new Schema({
    number:{
        type: Number,
        required: true
    },
    server: {
        type: ForeignKey,
        ref: 'user'
    }
})

mongoose.model("table",table);
