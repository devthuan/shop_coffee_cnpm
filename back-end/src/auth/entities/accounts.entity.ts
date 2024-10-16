import { Exclude, Expose } from "class-transformer";
import { Bills } from "src/bill/entities/bill.entity";
import { Cart } from "src/cart/entities/cart.entity";
import { BaseEntity } from "src/common/base.entity";
import { ImportReceipts } from "src/import_receipt/entities/import_receipt.entity";
import { NotificationAccounts } from "src/notification/entities/notification-account.entity";
import { Notification } from "src/notification/entities/notification.entity";
import { Reviews } from "src/reviews/entities/review.entity";
import { Roles } from "src/role-permission/entities/roles.entity";
import { TransactionHistory } from "src/transaction-history/entities/transaction-history.entity";
import { UserInformation } from "src/user-information/entities/user-information.entity";
import { UseVouchers } from "src/voucher/entities/use-voucher.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity({name: "accounts"})
export class Accounts extends BaseEntity {
    
    @Column({unique: true})
    userName: string;

    @Column({unique: true})
    email: string;

    @Column()
    @Exclude()
    password: string;
    
    @Column({default: 0})
    balance: number
    
    @Column()
    ip : string
    
    @Column()
    device : string

    @Column()
    typeLogin: string

    @Column()
    isActive: boolean


    @Column({nullable: true})
    lastLogin: Date;  

    @ManyToOne(() => Roles, roles => roles.accounts)
    role: Roles;

    @OneToMany(() => Reviews, reviews => reviews.accounts)
    reviews : Reviews
    
    @OneToMany(() => NotificationAccounts, notificationAccounts => notificationAccounts.accounts)
    notificationAccounts : NotificationAccounts

    @OneToMany(() => Cart, cart => cart.accounts)
    cart : Cart

    @OneToMany(() => Bills, bills => bills.account)
    bills : Bills[]

    @OneToMany(() => UseVouchers, useVouchers => useVouchers.accounts)
    useVouchers : UseVouchers

    @OneToMany(() => ImportReceipts, importReceipts => importReceipts.account)
    importReceipt : ImportReceipts

    @OneToMany(() => Notification, Notification => Notification.account)
    notification : Notification

    @OneToMany(() => UserInformation, userInformation => userInformation.account)
    userInformation : UserInformation

    @OneToMany(() => TransactionHistory, transactionHistory => transactionHistory.account)
    transactionHistory : TransactionHistory

    
    
}
