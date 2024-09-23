import { BaseEntity } from "src/common/base.entity";
import {  Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Products } from "./products.entity";

@Entity({name: "productDiscount"})
export class ProductDiscount extends BaseEntity {

    @Column()
    discountName: string;

    @Column()
    discountCode: string;

    @Column()
    quantity: number;

    @Column()
    value: number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;


    @ManyToOne(() => Products, products => products.productDiscount)
    products: Products[];

   

   

}

