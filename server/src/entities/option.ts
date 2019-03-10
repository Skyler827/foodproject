import { BaseEntity, Entity, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { OptionMenu } from "./option_menu";
import { OptionOrder } from "./option_order";
import { Ingredient } from "./ingredient";
@Entity()
export class Option extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => OptionMenu, menu => menu.options)
    menu: OptionMenu;

    @OneToMany(type => OptionOrder, oo => oo.option)
    orders: OptionOrder[];

    @ManyToMany(type => Ingredient, i => i.options)
    @JoinTable()
    ingredients: Ingredient[];

    @Column()
    name: string;

    @Column()
    priceCents: number;
}
