import { BaseEntity, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { Item } from "./item";
import { Seat } from "./seat";
import { KitchenOrder } from "./kitchen_order";

@Entity()
export class ItemOrder extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => Item, item => item.orders)
    item: Item;

    @ManyToOne(type => Seat, seat => seat.itemOrders)
    seat: Seat;

    @ManyToOne(type => KitchenOrder, ko => ko.itemOrders)
    kitchenOrder: KitchenOrder;
}