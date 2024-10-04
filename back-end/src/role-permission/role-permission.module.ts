import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { Roles } from './entities/roles.entity';
import { Functions } from './entities/functions.entity';
import { RoleHasFunctions } from './entities/roles_has_functions.entity';
import { RoleService } from './role.service';
import { FunctionsService } from './function.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accounts, Roles, Functions, RoleHasFunctions])
  ],
  controllers: [RolePermissionController],
  providers: [RolePermissionService, RoleService, FunctionsService],
})
export class RolePermissionModule {}
