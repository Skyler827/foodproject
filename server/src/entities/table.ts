import { Entity, BaseEntity, PrimaryColumn, OneToMany, Column, ManyToOne } from "typeorm";
import { Order } from "./order";
import { SeatOrder } from "./seat_order";
import { DiningRoom } from "./dining_room";

@Entity()
export class Table extends BaseEntity {
    @PrimaryColumn()
    number: number;

    shape: "rectangle" | "oval" | "polygon" = "rectangle";
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
    points: Array<{x:number,y:number}> = [];
    rotate: number = 0;
    rotateUnits: string | undefined;
    @ManyToOne(type => DiningRoom, dr => dr.tables)
    diningRoom: DiningRoom;

    @OneToMany(type => Order, o => o.table)
    orders: Order[];

    @OneToMany(type => SeatOrder, s => s.table)
    seats: SeatOrder[];
}
