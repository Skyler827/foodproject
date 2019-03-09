import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, Index } from "typeorm";
import { ItemOrder } from "./item_order";
import { Order } from "./order";
import { Table } from "./table";

@Entity()
@Index(["table", "seatNumber"], {unique:true})
export class Seat extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("integer")
    seatNumber: number;

    @ManyToOne(type => Table, t => t.seats)
    table: Table;
    
    @ManyToOne(type => Order, o => o.seats)
    order: Order;

    @OneToMany(type => ItemOrder, itemOrder => itemOrder.seat)
    itemOrders: ItemOrder[];
}