import { BaseEntity, Entity, OneToMany, ManyToOne, Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item";
import { SeatOrder } from "./seat_order";
import { KitchenOrder } from "./kitchen_order";
import { Option } from "./option";
import { OptionOrder } from "./option_order";
import { foodStatus } from "../def/foodstatus";

@Entity()
export class ItemOrder extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(type => Item, item => item.orders)
    item: Item;

    @OneToMany(type => OptionOrder, o => o.itemOrder)
    optionOrders: OptionOrder[];

    @ManyToOne(type => SeatOrder, seat => seat.itemOrders)
    seat: SeatOrder;

    @ManyToOne(type => KitchenOrder, ko => ko.itemOrders)
    kitchenOrder: KitchenOrder;

    @Column({default: ""})
    optionLine: string;

    @CreateDateColumn()
    orderTime: Date;

    @Column({type: "enum", enum: foodStatus, default: foodStatus.cooking})
    status: foodStatus;
}