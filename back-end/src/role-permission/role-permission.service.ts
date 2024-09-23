import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Roles } from './entities/roles.entity';
import { Functions } from './entities/functions.entity';
import { RoleHasFunctions } from './entities/roles_has_functions.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { RespondInterfaceGET, RespondInterfacePOST } from 'src/common/interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateAuthDto } from 'src/auth/dto/register.dto';
import { CreateFunctionDto } from './dto/create-function.dto';
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

    async createRoles(createRoles: CreateRoleDto): Promise<RespondInterfacePOST> {
        try {
            const newRole =  this.rolesRepository.create({
                name: createRoles.name,
                codeName: createRoles.codeName,
                guardName: createRoles.guardName
            })

            await this.rolesRepository.save(newRole);

            return {
                statusCode: 200,
                status: "success",
                message: "Role created successfully",
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

    async createFunctions(createFunction : CreateFunctionDto): Promise<RespondInterfacePOST> {
        try {
            const newFunctions = this.functionsRepository.create({
                name: createFunction.name,
                codeName: createFunction.codeName,
                guardName: createFunction.guardName,
                description: createFunction.description
            })

            await this.functionsRepository.save(newFunctions)

             return {
                statusCode: 200,
                status: "success",
                message: "Function created successfully",
                data: null
            }

        } catch (error) {
            console.log(error)
            return {
                statusCode: 500,
                status: 'error',
                message: 'Internal Server Error',
                data: null
            }
        }
    }

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

    async deleteSoftRole(codeNameRole: string): Promise<RespondInterfacePOST> {
        try {
            const role = await this.rolesRepository.findOne({where: {codeName: codeNameRole}});
            role.deletedAt = new Date();
            await this.rolesRepository.save(role);

            return {
                statusCode: 200,
                status:'success',
                message: 'Role deleted successfully',
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

    async deleteSoftFunction(codeNameFunction: string): Promise<RespondInterfacePOST> {
        try {
            const functionEntity = await this.functionsRepository.findOne({where: {codeName: codeNameFunction}});
            functionEntity.deletedAt = new Date();
            await this.functionsRepository.save(functionEntity);
            return {
                statusCode: 200,
                status:'success',
                message: 'Function deleted successfully',
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

   
        
}
