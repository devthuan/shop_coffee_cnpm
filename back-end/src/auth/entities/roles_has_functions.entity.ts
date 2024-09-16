import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Roles } from "./roles.entity";
import { Functions } from "./functions.entity";

@Entity({name: "roleHasFunctions"})
export class RoleHasFunctions extends BaseEntity {
    
    @Column()
    isActive: boolean;

    @ManyToOne(() => Roles, roles => roles.roleHasFunctions)
    roles: Roles;

    @ManyToOne(() => Functions, functions => functions.roleHasFunctions)
    functions: Functions;
    
    
    
}
