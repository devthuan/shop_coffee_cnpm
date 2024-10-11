import { BaseEntity } from "src/common/base.entity";
import {  Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Products } from "./products.entity";
import { Attributes } from "src/attribute/entities/attributes.entity";
import { SubAttributes } from "src/sub-attribute/entities/sub-attribute.entity";
import { Cart } from "src/cart/entities/cart.entity";

@Entity({name: "productAttributeValue"})
export class ProductAttributeValue extends BaseEntity {

    @Column()
    sellPrice: number

    @Column()
    buyPrice: number
    
    @Column({default: 0})
    quantity: number

 
    @ManyToOne(() => Products, products => products.productAttributeValue)
    products: Products;

    @ManyToOne(() => SubAttributes, subAttributes => subAttributes.productAttributeValue)
    subAttributes: SubAttributes;

    @OneToMany(() => Cart, cart => cart.productAttributeValue)
    cart: Cart;
}

