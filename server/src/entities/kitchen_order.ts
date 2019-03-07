import { Entity, BaseEntity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, Column } from "typeorm";
import { ItemOrder } from "./item_order";
import { foodStatus } from "../def/foodstatus";

@Entity()
export class KitchenOrder extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => ItemOrder, io => io.kitchenOrder)
    itemOrders: ItemOrder[];

    @CreateDateColumn()
    openTime: Date;

    @Column({type:"enum",enum:foodStatus,default:foodStatus.cooking})
    status: foodStatus;
}