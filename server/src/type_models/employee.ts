import { BaseEntity, Entity, OneToMany } from "typeorm";
import { Order } from "./order";

@Entity()
export class Employee extends BaseEntity {
    @OneToMany(type => Order, o => o.server)
    orders: Order[];
}