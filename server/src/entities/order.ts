import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, CreateDateColumn } from "typeorm";
import { SeatOrder } from "./seat_order";
import { Table } from "./table";
import { User } from "./user";

@Entity()
export class Order extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    open: boolean

    @OneToMany(type => SeatOrder, seat => seat.order)
    seats: SeatOrder[];

    @ManyToOne(type => Table, table=> table.orders)
    table: Table;

    @ManyToOne(type => User, e => e.orders)
    server: User;

    @CreateDateColumn()
    openTime: Date
}