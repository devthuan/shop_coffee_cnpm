import { Accounts } from "src/auth/entities/accounts.entity";
import { BaseEntity } from "src/common/base.entity";
import { Supplier } from "src/supplier/entities/supplier.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ImportReceiptDetail } from "./import_receipt_detail.entity";

@Entity({name: "importReceipts"})
export class ImportReceipts extends BaseEntity {

    @Column()
    totalAmount: number

    @Column()
    note: string;

    @Column()
    status: string;

    @ManyToOne(() => Supplier, supplier => supplier.importReceipt)
    supplier: Supplier;

    @ManyToOne(() => Accounts, accounts => accounts.importReceipt)
    account: Accounts;

    @OneToMany(() => ImportReceiptDetail, importReceiptDetail => importReceiptDetail.importReceipt)
    importReceiptDetail: ImportReceiptDetail[];

    
}
