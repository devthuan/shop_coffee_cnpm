import { BaseEntity } from "src/common/base.entity";
import {  Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Products } from "../../product/entities/products.entity";

@Entity({name: "productDiscount"})
export class ProductDiscount extends BaseEntity {

    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    quantity: number;

    @Column()
    value: number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;


    @ManyToOne(() => Products, products => products.productDiscount)
    products: Products;

   

   

}

