import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Roles } from './entities/roles.entity';
import { Functions } from './entities/functions.entity';
import { RoleHasFunctions } from './entities/roles_has_functions.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { RespondInterfacePOST } from 'src/common/interface';
import { createRoleHasFunctions } from './dto/create-role-has-function.dto';

@Injectable()
export class RolePermissionService {
    constructor(
        @Inject(CACHE_MANAGER) 
        private cacheManager: Cache,

        @InjectRepository(Roles)
        private readonly rolesRepository: Repository<Roles>, 
        @InjectRepository(Functions)
        private readonly functionsRepository: Repository<Functions>, 
        @InjectRepository(RoleHasFunctions)
        private readonly roleHasFunctionsRepository: Repository<RoleHasFunctions>, 

        private readonly dataSource: DataSource
    ){}



    async createRoleHasFunctions(createRoleHasFunctions : createRoleHasFunctions): Promise<RespondInterfacePOST> {
        try {
            const newRoleHasFunctions = this.roleHasFunctionsRepository.create({
                roles: {
                    id: (await this.rolesRepository.findOne({where: {codeName: createRoleHasFunctions.codeNameRole}})).id
                },
                functions: {
                    id: (await this.functionsRepository.findOne({where: {codeName: createRoleHasFunctions.codeNameFunction}})).id
                }
            })
            await this.roleHasFunctionsRepository.save(newRoleHasFunctions)
            return {
                statusCode: 200,
                status: "success",
                message: "Role has functions created successfully",
                data: null
            }
            
        } catch (error) {
            return {
                statusCode: 500,
                status: 'error',
                message: 'Internal Server Error',
                data: null
            }
        }
    } 

    async getRolePermissions(): Promise<RespondInterfacePOST> {
       try {
        const data = await  this.dataSource
        .getRepository(RoleHasFunctions)
        .createQueryBuilder('roleHasFunctions')
        .leftJoinAndSelect('roleHasFunctions.roles', 'roles')
        .leftJoinAndSelect('roleHasFunctions.functions', 'functions')
        .where('roleHasFunctions.deletedAt is null')
        .getMany()

        return {
            statusCode: 200,
            status:'success',
            message: 'Role Permissions fetched successfully',
            data: data
        }

        
       } catch (error) {
        return {
            statusCode: 500,
            status: 'error',
            message: 'Internal Server Error',
            data: null
        }
       }
    }

        
}
