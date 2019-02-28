import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { ItemOrder } from "./item_order";
import { Order } from "./order";

@Entity()
export class Seat extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    seatNumber: number;
    
    @OneToMany(type => ItemOrder, itemOrder => itemOrder.seat)
    itemOrders: ItemOrder[];

    @ManyToOne(type => Order, o => o.seats)
    order: Order;
}