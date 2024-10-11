import { BaseEntity } from "src/common/base.entity";
import { Column, Entity } from "typeorm";


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


}
