import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Supplier } from "./supplier.entity";
import { Products } from "src/product/entities/products.entity";
import { ProductAttributes } from "src/product/entities/productAttributes.entity";


@Entity({name: "detailSupplier"})
export class DetailSupplier extends BaseEntity {

    @Column()
    price: number
    
    @Column()
    version: number
    
    
    @ManyToOne(() => Supplier, supplier => supplier.detailSupplier)
    supplier: Supplier;
    
    @ManyToOne(() => ProductAttributes, productAttributes => productAttributes.detailSupplier)
    productAttribute: ProductAttributes;
    

}
