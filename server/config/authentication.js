
module.exports = function(req, res, next) {
    const User = require("mongoose").model("user");
    if (req.session) {
        console.log(req.session);
    } else {
        console.log("no session");
        if(Math.random()<0.9) {

            req.session.ayyy = "ayyyyyy";
        }
    }
    next();
}
