import { Accounts } from "src/auth/entities/accounts.entity";
import { BaseEntity } from "src/common/base.entity";
import { Products } from "src/product/entities/products.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ImportReceipts } from "./import_receipt.entity";
import { ProductAttributes } from "src/product/entities/productAttributes.entity";

@Entity({name: "importReceiptDetail"})
export class ImportReceiptDetail extends BaseEntity {

    @Column()
    quantity: number

    @Column()
    unitPrice: number

    @Column()
    totalPrice: number

    @ManyToOne(() => ProductAttributes, productAttributes => productAttributes.importReceiptDetail)
    productAttribute: ProductAttributes;
    
    @ManyToOne(() => ImportReceipts, importReceipts => importReceipts.importReceiptDetail)
    importReceipt: ImportReceipts;
 
}
