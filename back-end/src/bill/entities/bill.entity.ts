import { Accounts } from "src/auth/entities/accounts.entity";
import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BillDetails } from "./bill-detail.entity";
import { Payments } from "src/payment/entities/payment.entity";
import { Vouchers } from "src/voucher/entities/vouchers.entity";

@Entity({name: "bills"})
export class Bills extends BaseEntity{

    @Column()
    status: string

    @Column()
    total: number;

    @Column()
    totalDiscount: number
    
    @Column()
    totalPayment: number;
    
    @Column()
    fullName: string

    @Column()
    deliverAddress: string;
    
    @Column()
    deliverPhone: string;

    @Column()
    shippingMethod: string;

    @Column()
    note: string;

    @ManyToOne(() => Accounts, accounts => accounts.bills)
    account: Accounts;

    @ManyToOne(() => Payments, payments => payments.bills)
    payments: Payments;

    @ManyToOne(() => Vouchers, vouchers => vouchers.bills)
    vouchers: Vouchers;

    @OneToMany(()=> BillDetails, billDetails => billDetails.bills)
    billDetails: BillDetails[]


   
}
