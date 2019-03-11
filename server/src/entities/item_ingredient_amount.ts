import { BaseEntity, Entity, ManyToOne, Column } from "typeorm";
import { Ingredient } from "./ingredient";
import { Item } from "./item";

@Entity()
export class ItemIngredientAmount extends BaseEntity {
    @ManyToOne(type => Ingredient, {primary: true})
    ingredient: Ingredient;

    @ManyToOne(type => Item, {primary:true})
    item: Item;
    
    /**
     * quantity is the amount of an ingredient in terms of the base unit
     */
    @Column("numeric", {precision: 12, scale: 2})
    quantity: number;
}