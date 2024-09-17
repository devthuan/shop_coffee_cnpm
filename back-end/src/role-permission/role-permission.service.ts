import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Roles } from './entities/roles.entity';
import { Functions } from './entities/functions.entity';
import { RoleHasFunctions } from './entities/roles_has_functions.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { RespondInterfaceGET, RespondInterfacePOST } from 'src/common/interface';

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

    async getAllRoles(): Promise<RespondInterfacePOST> {
        try {
            const roles = await this.rolesRepository.find();
            return {
                statusCode: 200,
                status:'success',
                message: 'Roles fetched successfully',
                data: roles
            }
            
        } catch (error) {
            console.log(error);
            return {
                statusCode: 500,
                status: 'error',
                message: 'Internal Server Error',
                data: null
            }
        }
    }

    async getAllFunctions(): Promise<RespondInterfacePOST> {
        try {
            const functions = await this.functionsRepository.find();
            return {
                statusCode: 200,
                status:'success',
                message: 'Functions fetched successfully',
                data: functions
            }
            
        } catch (error) {
            console.log(error);
            return {
                statusCode: 500,
                status: 'error',
                message: 'Internal Server Error',
                data: null
            }
        }
    }

   
        
}
