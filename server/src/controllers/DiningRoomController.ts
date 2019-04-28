import { Table } from "../entities/table";
import * as express from "express";
import { DiningRoom } from "../entities/dining_room";
const router = express.Router();

router.get("/", async function(req, res) {
    try {
        const diningRooms = await DiningRoom.find();
        res.json(diningRooms);
    } catch (e) {
        res.status(500).json(e);
    }
});
router.get("/:number", async function(req, res) {
    // Note:
    // I tried using a typeORM `where` argument to the `find` method here
    // but was having problems; If you can figure out how to replace the
    // filter statement with a typeORM expression, please do so!
    const tables: Table[] = (await Table.find({
        relations: ["orders", "seats", "diningRoom"]
    })).filter(t => {
        console.log(`${t.number}: ${t.diningRoom.id} ${req.params.number}`);
        return t.diningRoom.id == req.params.number
    }).sort((t1, t2) => t1.number - t2.number);
    console.log(tables);
    res.json(tables);
});
export { router as DiningRoomController }
