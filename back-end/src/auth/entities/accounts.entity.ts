import { BaseEntity } from "src/common/base.entity";
import { Reviews } from "src/product/entities/review.entity";
import { Roles } from "src/role-permission/entities/roles.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity({name: "accounts"})
export class Accounts extends BaseEntity {
    
    @Column({unique: true})
    userName: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;
    
    @Column({default: 0})
    balance: number
    
    @Column()
    ip : string
    
    @Column()
    device : string

    @Column()
    typeLogin: string

    @Column()
    isActive: boolean


    @Column({nullable: true})
    lastLogin: Date;  

    @ManyToOne(() => Roles, roles => roles.accounts)
    role: Roles;

    @OneToMany(() => Reviews, reviews => reviews.accounts)
    reviews : Reviews
    
}
