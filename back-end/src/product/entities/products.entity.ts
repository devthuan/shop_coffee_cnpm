import { BaseEntity } from "src/common/base.entity";
import {  Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Images } from "./images.entity";
import { ProductDiscount } from "../../discount/entities/product_discount.entity";
import { ProductAttributes } from "./product_attributes.entity";
import { Reviews } from "../../reviews/entities/review.entity";
import { Categories } from "src/categories/entities/category.entity";

@Entity({name: "products"})
export class Products extends BaseEntity {

    @Column()
    name: string;

    @Column()
    sellPrice: number;

    @Column()
    buyPrice: number;

    @Column()
    description: string;

    @ManyToOne(() => Categories, categories => categories.products)
    category: Categories;


    @OneToMany(() =>Images,images =>images.products)
    images : Images;
    
    @OneToMany(() => Reviews, reviews => reviews.products)
    reviews: Reviews;

    @OneToMany(() => ProductDiscount, productDiscount => productDiscount.products)
    productDiscount: ProductDiscount;

    @OneToMany(() => ProductAttributes, productAttributes => productAttributes.products)
    productAttributes: ProductAttributes;

}

