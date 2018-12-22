let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;
let ForeignKey = Schema.Types.ObjectId;

let option = new Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category: {
        type: ForeignKey,
        refPath: 'option_menu',
        required: true
    },
    ingredients:{
        type:[ForeignKey],
        ref: 'ingredient',
        required:true
    }
})

mongoose.model("option",option);