import { Entity, BaseEntity, PrimaryColumn, OneToMany, Column } from "typeorm";
import { Table } from "./table";
@Entity()
export class DiningRoom extends BaseEntity{
    @PrimaryColumn()
    id: number;

    name: string;

    @OneToMany(type => Table, t => t.diningRoom)
    tables: Table[];
}