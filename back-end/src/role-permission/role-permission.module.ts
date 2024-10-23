import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { RoleHasFunctions } from './entities/roles_has_functions.entity';
import { Roles } from 'src/role/entities/roles.entity';
import { Functions } from 'src/function/entities/functions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accounts, RoleHasFunctions, Roles, Functions])
  ],
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
  exports: [RolePermissionService]
})
export class RolePermissionModule {}
