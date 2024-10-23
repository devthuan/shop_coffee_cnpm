import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RoleHasFunctions } from './entities/roles_has_functions.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { RespondInterfacePOST } from 'src/common/interface';
import { createRoleHasFunctions } from './dto/create-role-has-function.dto';
import { CommonException } from 'src/common/exception';
import { Roles } from 'src/role/entities/roles.entity';
import { Functions } from 'src/function/entities/functions.entity';

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
        .andWhere('roleHasFunctions.isActive = :isActive', {isActive : true})
        .getMany();

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
    async getRolePermissionsByRole(roleCodeName: string): Promise<RespondInterfacePOST> {
       try {
        const data = await  this.dataSource
        .getRepository(RoleHasFunctions)
        .createQueryBuilder('roleHasFunctions')
        .leftJoinAndSelect('roleHasFunctions.roles', 'roles')
        .leftJoinAndSelect('roleHasFunctions.functions', 'functions')
        .where('roleHasFunctions.deletedAt is null')
        .andWhere('roles.codeName = :codeName', {codeName : roleCodeName})
        .getMany();

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

    async changeStatusPermission(id: string) : Promise<{statusCode: number, status: string, message: string}> {
        try {

            const permission = await this.roleHasFunctionsRepository.createQueryBuilder('roleHasFunctions')
            .where('roleHasFunctions.deletedAt is null')
            .andWhere('roleHasFunctions.id = :id', { id })
            .getOne();

            if (!permission) {
                throw new BadRequestException('Permission not found');
            }

            permission.isActive =!permission.isActive;
            permission.updatedAt = new Date();
            await this.roleHasFunctionsRepository.save(permission);

            return {
                statusCode: 200,
                status:'success',
                message: `change status successfully`
            }
        } catch (error) {
            CommonException.handle(error)
        }
    }

        
}
