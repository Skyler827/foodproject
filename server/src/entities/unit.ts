import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Ingredient } from "./ingredient";

export enum UnitKind {
    Mass,
    Volume,
}

@Entity()
export class Unit extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "enum", enum: UnitKind, default: UnitKind.Mass})
    kind: UnitKind;

    @Column()
    name: string;

    @Column()
    magnitude: number;

    @OneToMany(type => Ingredient, i => i.bulkUnit)
    ingredientsBulk: Promise<Ingredient[]>;
}
