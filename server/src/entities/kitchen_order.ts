import { Entity, BaseEntity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ItemOrder } from "./item_order";

@Entity()
export class KitchenOrder extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => ItemOrder, io => io.kitchenOrder)
    itemOrders: ItemOrder[]
}