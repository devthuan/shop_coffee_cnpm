import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { UseVouchers } from "./use-voucher.entity";
import { Bills } from "src/bill/entities/bill.entity";

@Entity({name: "vouchers"})
export class Vouchers extends BaseEntity {

    @Column()
    code: string;

    @Column()
    name: string;

    @Column()
    value: number;

    @Column()
    quantity: number;

    @Column()
    description: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({default: "active"})
    status: string;

    @OneToMany(()=> UseVouchers, useVouchers => useVouchers.vouchers)
    useVouchers : UseVouchers

    @OneToMany(()=> Bills, bills => bills.vouchers)
    bills : Bills



}
