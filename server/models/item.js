let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;
let ForeignKey = Schema.Types.ObjectId;

let item = new Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    inventory:{
        type:Number,
        required:true
    },
    category: {
        type: ForeignKey,
        refPath: 'category',
        required: true
    },
    ingredients:{
        type:[String],
        required:true
    }
})

mongoose.model("item",item);