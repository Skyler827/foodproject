import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { Item } from "./item";

@Entity()
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @OneToMany(type => Item, item => item.category)
    items: Item[];
}