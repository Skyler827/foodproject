let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;

let user = new Schema({
    name:{
        type:String,
        required:true
    },
    hashpassword:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        required:true
    }
})
mongoose.model("user",user);
