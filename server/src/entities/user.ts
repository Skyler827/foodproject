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

    static userFactory(name: string, password: string, type: UserType): User {
        const u = new User();
        u.name = name;
        u.type = type;
        u.pass_hash = User.hash(password);
        return u;
    }
    static hash(password: string): string {
        const salt = bcrypt.genSaltSync();
        return bcrypt.hashSync(password, salt);
    }

    check(password: string) {
        return bcrypt.compareSync(password, this.pass_hash);
    }
}