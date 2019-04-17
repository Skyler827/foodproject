import { Entity, BaseEntity, PrimaryColumn, OneToMany, Column } from "typeorm";
import { Order } from "./order";
import { SeatOrder } from "./seat_order";

@Entity()
export class Table extends BaseEntity {
    @PrimaryColumn()
    number: number;

    @OneToMany(type => Order, o => o.table)
    orders: Order[];

    @OneToMany(type => SeatOrder, s => s.table)
    seats: SeatOrder[];
}
