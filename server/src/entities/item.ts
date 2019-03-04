import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { menuItem } from "../config/menuItem";
import { Category } from "./category";
import { ItemOrder } from "./item_order";
import { OptionMenu } from "./option_menu";
@Entity()
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @ManyToOne(type => Category, category => category.items)
    category: Category;
    
    @OneToMany(type => ItemOrder, itemOrder => itemOrder.item)
    orders: Promise<ItemOrder[]>;

    @ManyToMany(type => OptionMenu)
    @JoinTable()
    options: OptionMenu[];

    static factory(record: menuItem, category: Category): Item {
        const item = new Item();
        item.name = record.name;
        item.category = category;
        return item;
    }
}