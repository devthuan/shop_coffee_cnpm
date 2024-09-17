import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { RoleHasFunctions } from "./roles_has_functions.entity";

@Entity({name: "functions"})
export class Functions extends BaseEntity {
    
    @Column({unique: true})
    name: string;

    @Column({unique: true})
    codeName: string;

    @Column()
    guardName: string;

    @Column()
    description: string;

    @Column()
    isActive: boolean;

    @OneToMany(() => RoleHasFunctions, roleHasFunctions => roleHasFunctions.functions)
    roleHasFunctions : RoleHasFunctions;

    
    
    
}
