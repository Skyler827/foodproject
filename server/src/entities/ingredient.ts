import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Unit } from "./unit";

@Entity()
export class Ingredient extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:true})
    name: string;

    @Column({type:"real", default:0})
    supplyInBulkUnits: number;

    @OneToMany(type => Unit, u => u.ingredient)
    units: Unit[];
    
    @OneToOne(type => Unit, {nullable:true})
    @JoinColumn()
    bulkUnit: Unit;

    @Column({nullable:true})
    bulkUnitCostCents: number;
}
