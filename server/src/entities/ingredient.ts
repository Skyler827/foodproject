import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToMany } from "typeorm";
import { Unit } from "./unit";
import { Option } from "./option";
import { Item } from "./item";
import { ItemIngredientAmount } from "./item_ingredient_amount";
import { OptionIngredientAmount } from "./option_ingredient_amount";

@Entity()
export class Ingredient extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:true})
    name: string;

    @Column({type:"real", default:0})
    supplyInBaseUnits: number;

    @OneToMany(type => Unit, u => u.ingredient)
    units: Unit[];
    
    @OneToOne(type => Unit, {nullable:true})
    @JoinColumn()
    bulkUnit: Unit;

    @Column({nullable:true})
    bulkUnitCostCents: number;

    @OneToMany(type => ItemIngredientAmount, iia => iia.item)
    itemAmounts: Item[];

    @OneToMany(type => OptionIngredientAmount, oia => oia.ingredient)
    optionAmounts: OptionIngredientAmount[]
}
