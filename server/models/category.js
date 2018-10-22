let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;
let ForeignKey = Schema.Types.ObjectId;

let category = new Schema({
    name:{
        type:String,
        required:true
        
    }
})

mongoose.model("category",category);