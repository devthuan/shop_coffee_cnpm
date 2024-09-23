import { BaseEntity } from "src/common/base.entity";
import {  Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ProductAttributes } from "./product_attributes.entity";

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

