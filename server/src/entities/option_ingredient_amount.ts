import { BaseEntity, Entity, ManyToOne, Column } from "typeorm";
import { Ingredient } from "./ingredient";
import { Option } from "./option";

@Entity()
export class OptionIngredientAmount extends BaseEntity {
    @ManyToOne(type => Ingredient, i => i.optionAmounts, {primary: true})
    ingredient: Ingredient;

    @ManyToOne(type => Option, o => o.ingredientAmounts, {primary: true})
    option: Option;

    @Column("numeric", {precision: 12, scale: 2})
    quantity: number;
}