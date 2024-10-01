import { Attributes } from "src/attribute/entities/attributes.entity";
import { Cart } from "src/cart/entities/cart.entity";
import { BaseEntity } from "src/common/base.entity";
import { ProductAttributeValue } from "src/product/entities/product_attribute_values.entity";
import {  Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity({name: "subAttributes",})
export class SubAttributes extends BaseEntity {

    @Column()
    name: string;

   
    @ManyToOne(() => Attributes, attributes => attributes.subAttributes)
    attributes: Attributes;

    @OneToMany(() => ProductAttributeValue, productAttributeValue => productAttributeValue.subAttributes)
    productAttributeValue: ProductAttributeValue;

    
   

}

