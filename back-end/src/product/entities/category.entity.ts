import { BaseEntity } from "src/common/base.entity";
import {  Column, Entity, OneToMany } from "typeorm";
import { Products } from "./products.entity";

@Entity({name: "categories"})
export class Categories extends BaseEntity {

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => Products, products => products.category)
    products: Products[];

}

