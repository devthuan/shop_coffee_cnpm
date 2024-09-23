import { BaseEntity } from "src/common/base.entity";
import { ProductAttributes } from "src/product/entities/product_attributes.entity";
import {  Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity({name: "attributes"})
export class Attributes extends BaseEntity {

    @Column()
    code: string;
 
    @Column()
    name: string;

    @Column()
    description: string;

   
    @OneToMany(() => ProductAttributes, productAttributes => productAttributes.attributes)
    productAttributes: ProductAttributes;

   

}

