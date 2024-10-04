import { BaseEntity } from "src/common/base.entity";
import {  Column, Entity, OneToMany } from "typeorm";
import { NotificationAccounts } from "./notification-account.entity";

@Entity({name: "notification"})
export class Notification extends BaseEntity {

    @Column()
    title: string

    @Column()
    content: string

    @Column({default: 1})
    isActive: boolean

    @OneToMany(() => NotificationAccounts, notificationAccounts => notificationAccounts.notification)
    notificationAccounts: NotificationAccounts


}
