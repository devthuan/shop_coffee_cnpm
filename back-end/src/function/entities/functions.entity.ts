import { BaseEntity } from "src/common/base.entity";
import { RoleHasFunctions } from "src/role-permission/entities/roles_has_functions.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({name: "functions"})
export class Functions extends BaseEntity {
    
    @Column({unique: true})
    name: string;

    @Column({unique: true})
    codeName: string;

    @Column()
    method: string;

    @Column()
    endpoint: string;

    @Column({default: "1"})
    isActive: boolean;

    @OneToMany(() => RoleHasFunctions, roleHasFunctions => roleHasFunctions.functions)
    roleHasFunctions : RoleHasFunctions;

    
    
    
}
