import { Entity, BaseEntity, PrimaryColumn, OneToMany, Column } from "typeorm";
import { Order } from "./order";
import { Seat } from "./seat";

@Entity()
export class Table extends BaseEntity {
    @PrimaryColumn()
    number: number;

    @OneToMany(type => Order, o => o.table)
    orders: Order[];

    @OneToMany(type => Seat, s => s.table)
    seats: Seat[];
}
