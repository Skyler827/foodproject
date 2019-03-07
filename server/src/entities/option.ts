import { BaseEntity, Entity, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OptionMenu } from "./option_menu";
import { OptionOrder } from "./option_order";
@Entity()
export class Option extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => OptionMenu, menu => menu.options)
    menu: OptionMenu;

    @OneToMany(type => OptionOrder, oo => oo.option)
    orders: OptionOrder[];

    @Column()
    name: string;

    @Column()
    priceCents: number;
}