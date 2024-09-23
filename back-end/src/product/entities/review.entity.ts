import { BaseEntity } from "src/common/base.entity";
import {  Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Products } from "./products.entity";
import { Accounts } from "src/auth/entities/accounts.entity";

@Entity({name: "reviews"})
export class Reviews extends BaseEntity {

    @Column()
    rating: string;

    @Column()
    comment: string;


    @ManyToOne(() => Products, products => products.reviews)
    products: Products[];

    @ManyToOne(() => Accounts, accounts => accounts.reviews)
    accounts: Accounts[];
   
   
   

}

