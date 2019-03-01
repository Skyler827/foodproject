import { BaseEntity, Entity, OneToMany, PrimaryGeneratedColumn, Column } from "typeorm";
import { Order } from "./order";
import bcrypt = require('bcrypt');

export enum UserType  {
    Guest,
    Cashier,
    Server,
    Cook,
    Manager
}
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "enum", enum: UserType, default: UserType.Guest})
    type: UserType;

    @Column()
    name: string;

    @Column()
    pass_hash: string;

    @OneToMany(type => Order, o => o.server)
    orders: Order[];

    constructor(name: string, type: UserType, password: string) {
        super();
        this.name = name;
        this.type = type;
        this.pass_hash = User.hash(password || 'skyler');
    }
    static hash(password: string): string {
        const salt = bcrypt.genSaltSync();
        return bcrypt.hashSync(password, salt);
    }

    check(password: string) {
        return bcrypt.compareSync(password, this.pass_hash);
    }
}