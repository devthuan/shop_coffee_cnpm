import { BaseEntity } from "src/common/base.entity";
import {  Column, Entity, ManyToOne } from "typeorm";
import { Notification } from "./notification.entity";
import { Accounts } from "src/auth/entities/accounts.entity";

@Entity({name: "notificationAccounts"})
export class NotificationAccounts extends BaseEntity {

    @Column({default: 0})
    isRead: boolean;

    @ManyToOne(() => Notification, notification => notification.notificationAccounts)
    notification: Notification;

    @ManyToOne(() => Accounts, accounts => accounts.notificationAccounts)
    accounts: Accounts

}
