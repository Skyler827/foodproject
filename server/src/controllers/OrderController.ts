import * as express from 'express';
import { getRepository } from "typeorm";
import { Table } from "../entities/table";
const OrderController = express.Router();


export { OrderController }