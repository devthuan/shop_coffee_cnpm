import { BaseEntity } from "src/common/base.entity";
import {  Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { NotificationAccounts } from "./notification-account.entity";
import { Accounts } from "src/auth/entities/accounts.entity";

@Entity({name: "notification"})
export class Notification extends BaseEntity {

    @Column()
    typeSend: string

    @Column()
    title: string

    @Column()
    content: string

    @Column({default: 1})
    isActive: boolean

    @OneToMany(() => NotificationAccounts, notificationAccounts => notificationAccounts.notification)
    notificationAccounts: NotificationAccounts

    @ManyToOne(() => Accounts, Accounts => Accounts.notification)
    account: Accounts


}
