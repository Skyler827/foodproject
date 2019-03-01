import { BaseEntity, Entity, OneToMany, PrimaryGeneratedColumn, Column } from "typeorm";
import { Order } from "./order";

export enum UserType  {
    Guest,
    Cashier,
    Server,
    Cook,
    Manager
}
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "enum", enum: UserType, default: UserType.Guest})
    type: UserType;

    @OneToMany(type => Order, o => o.server)
    orders: Order[];
}