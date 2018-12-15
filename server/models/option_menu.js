let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;
let ForeignKey = Schema.Types.ObjectId;

let option_menu = new Schema({
    name: {
        type: String,
        required: true
    },
    minimum: {
        type: Number,
        required: true
    },
    num_free: {
        type: Number,
        required: false
    },
    maximum: {
        type: Number,
        required: false
    }
});

mongoose.model("option_menu", option_menu);