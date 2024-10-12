import { Accounts } from "src/auth/entities/accounts.entity";
import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({name: "userInformation"})
export class UserInformation extends BaseEntity {
    @Column({nullable: true})
    fullName: string;
    
    @Column({nullable: true})
    phoneNumber: string;
   
    @Column({nullable: true})
    email: string;
    
    @Column({nullable: true})
    avatar: string;
    
    @Column({ type: 'date', nullable: true })
    birthDate: Date;
    
    @Column({nullable: true})
    gender: string;

    @Column({nullable: true})
    address1: string;

    @Column({nullable: true})
    address2: string;
    
    @ManyToOne(() => Accounts, accounts => accounts.userInformation)
    account: Accounts;
    

}
