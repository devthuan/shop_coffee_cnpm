import { BaseEntity } from "src/common/base.entity";
import {  Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Products } from "./products.entity";
import { Attributes } from "src/attribute/entities/attributes.entity";
import { Cart } from "src/cart/entities/cart.entity";
import { BillDetails } from "src/bill/entities/bill-detail.entity";
import { DetailSupplier } from "src/supplier/entities/detail-supplier.entity";

@Entity({name: "productAttributes"})
export class ProductAttributes extends BaseEntity {

    @Column()
    sellPrice: number

    @Column()
    buyPrice: number
    
    @Column({default: 0})
    quantity: number

 
    @ManyToOne(() => Products, products => products.productAttributes)
    products: Products;
 
    @ManyToOne(() => Attributes, attributes => attributes.productAttributes)
    attributes: Attributes;


    @OneToMany(() => Cart, cart => cart.productAttributes)
    cart: Cart;

    @OneToMany(() => BillDetails, billDetails => billDetails.productAttributes)
    billDetails: BillDetails;
 
    @OneToMany(() => DetailSupplier, detailSupplier => detailSupplier.productAttribute)
    detailSupplier: DetailSupplier;
}

