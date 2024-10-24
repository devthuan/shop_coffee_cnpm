import { Accounts } from "src/auth/entities/accounts.entity";
import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Vouchers } from "./vouchers.entity";

@Entity({name: "useVouchers"})
export class UseVouchers extends BaseEntity {

    @Column()
    usingDate: Date;

    @ManyToOne(() => Accounts,  accounts => accounts.useVouchers)
    accounts: Accounts;

    @ManyToOne(() => Vouchers,  vouchers => vouchers.useVouchers)
    vouchers: Vouchers;



}
