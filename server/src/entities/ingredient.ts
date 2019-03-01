import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { Unit } from "./unit";

@Entity()
export class Ingredient extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column("real")
    supplyInBulkUnits: number;

    @ManyToMany(type => Unit)
    @JoinTable()
    units: Unit[];
    
    @ManyToOne(type => Unit)
    bulkUnit: Unit;

    @Column()
    bulkUnitCostCents: number;
}