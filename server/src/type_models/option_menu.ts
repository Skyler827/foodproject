import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity()
export class OptionMenu extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}