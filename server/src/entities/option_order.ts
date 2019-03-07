import { BaseEntity, ManyToOne, Column, Entity, PrimaryColumn } from "typeorm";
import { Min } from "class-validator";
import { Option } from "./option";
import { ItemOrder } from "./item_order";
import { foodStatus } from "../def/foodstatus";

@Entity()
export class OptionOrder extends BaseEntity {

    @ManyToOne(type => Option, o => o.orders, {primary: true})
    option: Option;

    @ManyToOne(type => ItemOrder, io => io.optionOrders, {primary: true})
    itemOrder: ItemOrder;

    @Column({type: "integer", default: 1})
    @Min(1)
    quantity: number;

    @Column({type:"enum", enum: foodStatus, default: foodStatus.cooking})
    status: foodStatus;
}