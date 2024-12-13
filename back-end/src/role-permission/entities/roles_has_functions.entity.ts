import { BaseEntity } from "src/common/base.entity";
import { Functions } from "src/function/entities/functions.entity";
import { Roles } from "src/role/entities/roles.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({name: "roleHasFunctions"})
export class RoleHasFunctions extends BaseEntity {
    
    @Column({default: "1"})
    isActive: boolean;

    @ManyToOne(() => Roles, roles => roles.roleHasFunctions)
    roles: Roles;

    @ManyToOne(() => Functions, functions => functions.roleHasFunctions)
    functions: Functions;
    
    
    
}
