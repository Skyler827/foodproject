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
    const n: number = req.params.number;
    const results: DiningRoom[] = await DiningRoom.find({
        where: {id: n},
        relations: ["tables"]
    });
    if (results.length == 1) {
        res.json(results[0]);
    }
    else if (results.length == 0){
        res.status(404).json({"message":`no such dining room with id ${n}`});
    } else {
        console.log(`there should not be more than one dining room with the same id (${n})`);
        console.log(results);
        process.exit(1);
    }
});
export { router as DiningRoomController }
