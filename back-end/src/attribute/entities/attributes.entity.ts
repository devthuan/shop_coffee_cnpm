import { BaseEntity } from "src/common/base.entity";
import { ProductAttributes } from "src/product/entities/productAttributes.entity";
import {  Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity({name: "attributes"})
export class Attributes extends BaseEntity {

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => ProductAttributes, productAttributes => productAttributes.attributes)
    productAttributes: ProductAttributes;


}

