import * as express from 'express';
import { User, UserType } from "../entities/user"; 
const router = express.Router();
router.get("/", function (req, res) {
    res.json({"ayy":"ayyyyyy"});
});
/**
 * get info on all users
 */
router.get("/all", async (req, res) => {
    let results = await User.find({select: ["id","type","name"]});
    res.json(results);
    console.log(results);
});

/**
 * get info on self
 */
router.get("/me", async (req, res) => {
    if (req.session) {
        const u = await User.findOne({where:{id:req.session.id}});
        res.json(u);
    } else {
        res.status(500).json({"error":"req.session was undefined"});
    }
});

/**
 * get info on a specific user
 */
router.get("/:id", async (req, res) => {
    const u = await User.findOne({where:{id:req.params.id}});
    res.json(u);
});

/**
 * register
 */
router.post("/register", async (req, res) => {
    const u = User.userFactory(req.body.username, req.body.password, UserType.Server);
    await User.insert(u);
    res.json(u);
});

/**
 * login
 */
router.post("/login", async (req, res)=>{
    const u = await User.findOne({where: {name:req.body.username}})
    if (!u) return res.json("invalid credentials");
    if (!req.session) return res.json({"error":"req.session was undefined"});
    if (u.check(req.body.password)) {
        req.session.userId = u.id.toString();
        req.session.userType = u.type;
        req.session.userName = u.name;
        return res.json({"user": u, "message": "login succesful"});
    } else {
        return res.json({"message":"invalid credentials"});
    }
});

/**
 * logout
 */
router.post("/logout", async (req, res) => {
    if (req.session) {
        delete req.session.userId;
        delete req.session.userType;
        delete req.session.userName;
        res.json("user logged out");
    } else {
        res.status(500).json({"error":"req.session was undefined"});
    }
});

export { router as AccountController };