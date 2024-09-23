import { BaseEntity } from "src/common/base.entity";
import {  Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Products } from "./products.entity";
import { Attributes } from "src/attribute/entities/attributes.entity";

@Entity({name: "productAttributes"})
export class ProductAttributes extends BaseEntity {

    @Column({default: 0})
    quantity: number

    @ManyToOne(() => Products, products => products.productAttributes)
    products: Products;

    @ManyToOne(() => Attributes, attributes => attributes.productAttributes)
    attributes: Attributes;

   

}

