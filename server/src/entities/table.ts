import { Entity, BaseEntity, PrimaryColumn, OneToMany, Column, ManyToOne } from "typeorm";
import { Order } from "./order";
import { SeatOrder } from "./seat_order";
import { DiningRoom } from "./dining_room";
import { TableShape } from "../def/tableShape";

@Entity()
export class Table extends BaseEntity {
    @PrimaryColumn()
    number: number;

    @Column({
        type:"enum",
        enum: TableShape,
        default: TableShape.RECTANGLE
    })
    shape: TableShape;
    @Column()
    x: number = 0;
    @Column()
    y: number = 0;
    @Column()
    width: number = 0;
    @Column()
    height: number = 0;
    @Column("simple-json")
    points: Array<{x:number,y:number}> = [];
    @Column()
    rotate: number = 0;
    @Column({nullable: true})
    rotateUnits: string;
    @ManyToOne(type => DiningRoom, dr => dr.tables)
    diningRoom: DiningRoom;

    @OneToMany(type => Order, o => o.table)
    orders: Order[];

    @OneToMany(type => SeatOrder, s => s.table)
    seats: SeatOrder[];
}
