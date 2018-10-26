let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;

let user = new Schema({
    name: {
        type: String,
        required: true
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
mongoose.model("user",user);
