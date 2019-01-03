let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;
let ForeignKey = Schema.Types.ObjectId;

let option_menu = new Schema({
    name: {
        type: String,
        required: true
    },
    min_options: {
        type: Number,
        required: true
    },
    free_options: {
        type: Number,
        required: true
    },
    max_options: {
        type: Number,
        required: false
    }
});

mongoose.model("option_menu", option_menu);