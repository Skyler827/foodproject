import { Entity, BaseEntity, PrimaryColumn, OneToMany, Column, ManyToOne } from "typeorm";
import { Order } from "./order";
import { SeatOrder } from "./seat_order";
import { DiningRoom } from "./dining_room";

@Entity()
export class Table extends BaseEntity {
    @PrimaryColumn()
    number: number;

    shape: "rectangle" | "oval" | "polygon" = "rectangle";
    x: number;
    y: number;
    width: number;
    height: number;
    points: Array<{x:number,y:number}>;

    @ManyToOne(type => DiningRoom, dr => dr.tables)
    diningRoom: DiningRoom;

    @OneToMany(type => Order, o => o.table)
    orders: Order[];

    @OneToMany(type => SeatOrder, s => s.table)
    seats: SeatOrder[];
}
