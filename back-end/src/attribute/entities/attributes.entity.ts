import { BaseEntity } from "src/common/base.entity";
import { ProductAttributeValue } from "src/product/entities/product_attribute_values.entity";
import { SubAttributes } from "src/sub-attribute/entities/sub-attribute.entity";
import {  Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity({name: "attributes"})
export class Attributes extends BaseEntity {

    @Column()
    name: string;

    @Column()
    description: string;

   
    @OneToMany(() => SubAttributes, subAttributes => subAttributes.attributes)
    subAttributes: SubAttributes;

   

}

