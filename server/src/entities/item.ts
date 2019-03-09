import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { menuItem } from "../def/menuItem";
import { Category } from "./category";
import { ItemOrder } from "./item_order";
import { OptionMenu } from "./option_menu";
import { Option } from "./option";
import { Ingredient } from "./ingredient";
@Entity()
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @ManyToOne(type => Category, category => category.items)
    category: Category;
    
    @ManyToMany(type => Ingredient, i => i.items)
    @JoinTable()
    ingredients: Ingredient[];

    @OneToMany(type => ItemOrder, itemOrder => itemOrder.item)
    orders: Promise<ItemOrder[]>;

    @ManyToMany(type => OptionMenu)
    @JoinTable()
    options: OptionMenu[];

    static async factory(record: menuItem, category: Category): Promise<Item> {
        const item = new Item();
        item.name = record.name;
        item.category = category;
        item.options = await Promise.all(record.options.map(optionName =>
            OptionMenu.findOneOrFail({where:[{name:optionName}]})
        ));
        return item;
    }
}