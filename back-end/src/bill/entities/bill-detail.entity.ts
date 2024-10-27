import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Bills } from "./bill.entity";
import { ProductAttributes } from "src/product/entities/productAttributes.entity";

@Entity({name: "billDetail"})
export class BillDetails extends BaseEntity {

    @Column()
    quantity: number

    @Column()
    price: number

    @Column()
    discount: number

    @ManyToOne(() => Bills, bills => bills.billDetails)
    bills: Bills;

    @ManyToOne(() => ProductAttributes, productAttributes => productAttributes.billDetails)
    productAttributes: ProductAttributes;

    



}