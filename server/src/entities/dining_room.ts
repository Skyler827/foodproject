import { Entity, BaseEntity, PrimaryColumn, OneToMany, Column } from "typeorm";
import { Table } from "./table";
@Entity()
export class DiningRoom extends BaseEntity{
    @PrimaryColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    width: number;
    @Column()
    length: number;
    @Column()
    units: string;

    @OneToMany(type => Table, t => t.diningRoom)
    tables: Table[];
}