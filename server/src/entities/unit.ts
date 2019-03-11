import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Ingredient } from "./ingredient";

@Entity()
export class Unit extends BaseEntity {
    @ManyToOne(type => Ingredient, i => i.units, {primary: true})
    ingredient: Ingredient;

    @Column({primary:true, type: "numeric", precision: 20, scale: 4})
    magnitude: number;

    @Column()
    name: string;

    toJson() { return {
        name:this.name,
        magnitude: this.magnitude,
        ingredient: this.ingredient.id   
    }}
}
