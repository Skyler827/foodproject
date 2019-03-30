import * as express from 'express';
import { getRepository } from "typeorm";
import { Table } from "../entities/table";
const router = express.Router();

router.get("/", async function(_req, res) {
    try {
        const tables = await Table.find();
        res.json(tables);
    } catch (e) {
        res.status(500).json(e);
    }
});

router.get("/:number", async function(req, res) {
    try {
        const tables = await getRepository(Table)
            .createQueryBuilder("t")
            .where("t.number = :num", {num:req.params.number})
            .innerJoinAndSelect("t.seats", "seat", "seat.table = t.number")
            .innerJoinAndSelect("seat.itemOrders", "io", "io.\"seatId\" = seat.id")
            .innerJoinAndSelect("io.item","item","item.id = io.\"itemId\"")
            .leftJoinAndSelect("io.optionOrders", "oo", "oo.\"itemOrderId\" = io.id")
            .getMany();
        if (!tables) {
            throw new Error(`no such table: ${req.params.id}`);
        } else {
            res.json(tables[0]);
        }
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
});

export { router as TableController }
