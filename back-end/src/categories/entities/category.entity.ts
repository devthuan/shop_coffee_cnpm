import { BaseEntity } from "src/common/base.entity";
import { Products } from "src/product/entities/products.entity";
import {  Column, Entity, OneToMany } from "typeorm";

@Entity({name: "categories"})
export class Categories extends BaseEntity {

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => Products, products => products.category)
    products: Products[];

}

