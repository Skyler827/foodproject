let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;

let table = new Schema({
    number:{
        type: Number,
        required: true
    }
})

mongoose.model("table",table);