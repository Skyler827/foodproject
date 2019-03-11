import { BaseEntity, Entity, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { OptionMenu } from "./option_menu";
import { OptionOrder } from "./option_order";
import { OptionIngredientAmount } from "./option_ingredient_amount";

@Entity()
export class Option extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => OptionMenu, menu => menu.options)
    menu: OptionMenu;

    @OneToMany(type => OptionOrder, oo => oo.option)
    orders: OptionOrder[];

    @OneToMany(type => OptionIngredientAmount, oia => oia.option)
    ingredientAmounts: OptionIngredientAmount[]

    @Column()
    name: string;

    @Column()
    priceCents: number;
}
