const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("user");
const bcrypt = require("bcryptjs");
8
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
        return User.create(req.body);
    }).then((newUser) => {
        req.session.uid = newUser._id;
        res.json(newUser);
    }).catch((err) => {
        if (err.short && err.short == "usernameTaken") 
            res.status(409).json(err);
        else res.status(500).json({message:err});
    });
});
router.post("/login", function(req, res) {
    new Promise((resolve, reject) => {
        User.find({username:req.body.username}, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    }).then(async (users) => {
        if (users.length === 0 )
            res.status(401).json({"message":"invalid credentials"});
        let passwordCorrect = await bcrypt.compare(req.body.password, users[0].hashpassword);
        if (passwordCorrect) {
            req.session.u_id = users[0]._id;
            res.json({"message":"login succesful", "user":users[0]});
        }
        else res.status(401).json({"message":"invalid credentials"});
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.post("/logout", function(req, res) {
    req.session.u_id = null;
    res.status(200).end();
});
module.exports = router;
