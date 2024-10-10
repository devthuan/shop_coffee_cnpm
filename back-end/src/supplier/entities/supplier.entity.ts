import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { DetailSupplier } from "./detail-supplier.entity";
import { ImportReceipts } from "src/import_receipt/entities/import_receipt.entity";


@Entity({name: "supplier"})
export class Supplier extends BaseEntity {

    @Column()
    name: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column()
    email: string;

    @Column()
    website: string;

    @Column()
    description: string;

    @Column()
    logo: string;

    @Column()
    bankAddress: string;

    @Column()
    bankName: string;

    @Column()
    bankAccountNumber: string;
    
    @Column({default: 1})
    isActive: boolean;

    @OneToMany(() => DetailSupplier, detailSupplier => detailSupplier.supplier)
    detailSupplier: DetailSupplier;

    @OneToMany(() => ImportReceipts, ImportReceipts => ImportReceipts.supplier)
    importReceipt: ImportReceipts;


}
