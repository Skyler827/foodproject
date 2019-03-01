import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Seat } from "./seat";
import { Table } from "./table";
import { User } from "./user";

@Entity()
export class Order extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => Seat, seat => seat.order)
    seats: Seat[];

    @OneToMany(type => Table, table=> table.orders)
    table: Table;

    @ManyToOne(type => User, e => e.orders)
    server: User;
}