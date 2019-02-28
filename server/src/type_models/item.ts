import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from "typeorm";
import { Category } from "./category";
import { ItemOrder } from "./item_order";

@Entity()
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @ManyToOne(type => Category, category => category.items)
    category: Category;
    
    @OneToMany(type => ItemOrder, itemOrder => itemOrder.item)
    orders: ItemOrder[];
}