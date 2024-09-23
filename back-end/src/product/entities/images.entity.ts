import { BaseEntity } from "src/common/base.entity";
import {  Column, Entity, ManyToOne } from "typeorm";
import { Products } from "./products.entity";

@Entity({name: "images"})
export class Images extends BaseEntity {

    @Column()
    urlImage: string;


    @ManyToOne(()=> Products, products => products.images)
    products: Products; 
  

}

