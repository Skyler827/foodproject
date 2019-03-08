import { BaseEntity, Entity, OneToMany, ManyToOne, Column, CreateDateColumn } from "typeorm";
import { Item } from "./item";
import { Seat } from "./seat";
import { KitchenOrder } from "./kitchen_order";
import { Option } from "./option";
import { OptionOrder } from "./option_order";
import { foodStatus } from "../def/foodstatus";

@Entity()
export class ItemOrder extends BaseEntity {
    @ManyToOne(type => Item, item => item.orders, { primary:true})
    item: Item;

    @OneToMany(type => OptionOrder, o => o.itemOrder, {primary: true})
    optionOrders: OptionOrder[];

    @ManyToOne(type => Seat, seat => seat.itemOrders, {primary:true})
    seat: Seat;

    @ManyToOne(type => KitchenOrder, ko => ko.itemOrders)
    kitchenOrder: KitchenOrder;

    @Column({default: ""})
    optionLine: string;

    @CreateDateColumn()
    orderTime: Date;

    @Column({type: "enum", enum: foodStatus, default: foodStatus.cooking})
    status: foodStatus;
}