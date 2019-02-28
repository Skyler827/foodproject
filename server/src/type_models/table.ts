import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, PrimaryColumn, OneToMany, Column } from "typeorm";
import { Order } from "./order";

@Entity()
export class Table extends BaseEntity {
    @PrimaryColumn()
    id: number;

    @OneToMany(type => Order, o => o.table)
    orders: Order[];
}