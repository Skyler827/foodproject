import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { menuItem } from "../def/menuItem";
import { Category } from "./category";
import { ItemOrder } from "./item_order";
import { OptionMenu } from "./option_menu";
import { ItemIngredientAmount } from "./item_ingredient_amount";
@Entity()
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    priceCents: number;
    
    @ManyToOne(type => Category, category => category.items)
    category: Category;
    
    @OneToMany(type => ItemIngredientAmount, iia => iia.ingredient)
    ingredientAmounts: ItemIngredientAmount[];

    @OneToMany(type => ItemOrder, itemOrder => itemOrder.item)
    orders: Promise<ItemOrder[]>;

    @ManyToMany(type => OptionMenu)
    @JoinTable()
    options: OptionMenu[];

}