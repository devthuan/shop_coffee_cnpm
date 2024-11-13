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
    description: string;

    @Column({nullable: true})
    website: string;

    @Column({nullable: true})
    logo: string;

    @Column({nullable: true})
    bankAddress: string;

    @Column({nullable: true})
    bankName: string;

    @Column({nullable: true})
    bankAccountNumber: string;
    
    @Column({default: 1})
    isActive: boolean;

    @OneToMany(() => DetailSupplier, detailSupplier => detailSupplier.supplier)
    detailSupplier: DetailSupplier[];

    @OneToMany(() => ImportReceipts, ImportReceipts => ImportReceipts.supplier)
    importReceipt: ImportReceipts;


}
