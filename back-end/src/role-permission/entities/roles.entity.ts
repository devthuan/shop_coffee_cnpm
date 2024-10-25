import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { RoleHasFunctions } from "./roles_has_functions.entity";
import { Accounts } from "src/auth/entities/accounts.entity";


@Entity({name: "roles"})
export class Roles extends BaseEntity {
    
    @Column({unique: true})
    name: string;

    @Column({unique: true})
    codeName: string;

    @Column()
    guardName: string;

    @Column({ default: "1"})
    isActive: boolean;

    @OneToMany(() => Accounts, accounts => accounts.role)
    accounts: Accounts;

    @OneToMany(() => RoleHasFunctions, roleHasFunctions => roleHasFunctions.roles)
    roleHasFunctions: RoleHasFunctions;



    
    
    
}
