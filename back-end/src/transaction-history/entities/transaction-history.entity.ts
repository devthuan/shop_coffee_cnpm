import { Accounts } from "src/auth/entities/accounts.entity";
import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({name: "transactionHistory"})
export class TransactionHistory extends BaseEntity {
    
    @Column()
    typeTransaction: string

    @Column()
    amount: number;

    @Column()
    balanceBefore: number;
    
    @Column()
    balanceAfter: number;
    
    @Column()
    description: string;

    @Column()
    status: string;

    @ManyToOne(()=> Accounts, accounts => accounts.transactionHistory)
    account: Accounts;

}
