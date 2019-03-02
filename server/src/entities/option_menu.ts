import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Option } from "./option";
import { Item } from "./item";
@Entity()
export class OptionMenu extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(tpye => Option, op => op.menu)
    options: Option[];

}