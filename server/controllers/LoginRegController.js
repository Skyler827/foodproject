const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("user");

router.post("/login", function(req, res) {
    res.send(req.body);
});
router.post("/register", function(req,res) {
    new Promise((resolve, reject)=> {
        User.find({username:req.body.username}, (err,data)=>{
            if (err) reject(err);
            else resolve(data);
        });
    }).then((usersWithSameName) => {
        if (usersWithSameName.length == 0) return ;
        else return new Promise((_, r) =>r({
            "short":"usernameTaken",
            "message":"cannot create User with same name as previous user"
        }));
    }).then(() => {
        console.log(req.body);
        return User.create(req.body);
    }).then((newUser) => {
        req.session.uid = newUser._id;
        res.json(newUser);
    }).catch((err) => {
        console.log(err);
        if (err.short && err.short == "usernameTaken") 
            res.status(409).json(err);
        else res.status(500).json({message:err});
    });

});
module.exports = router;
