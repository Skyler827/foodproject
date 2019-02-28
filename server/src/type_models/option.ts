import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { OptionMenu } from "./option_menu";
@Entity()
export class Option extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => OptionMenu, menu => menu.options)
    menu: OptionMenu;

    @Column()
    name: string;

    @Column()
    priceCents: number;
}