const mongoose   = require("mongoose");
const bcrypt     = require("bcryptjs"); 
const Schema     = mongoose.Schema;
let user = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    hashpassword: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ["manager", "bartender", "cook", "server", "cashier", "customer"],
        required: true
    }
})
user.pre('validate', function(next) {
    const salt  = bcrypt.genSaltSync();
    bcrypt.hash(this.password, salt, (err, hash)=>{
        if (err) this.invalidate();
        else this.hashpassword = hash;
        this.password = "";
        next();
    })
});
mongoose.model("user",user);
