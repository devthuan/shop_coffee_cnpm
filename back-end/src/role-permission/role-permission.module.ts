import { forwardRef, Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { RoleHasFunctions } from './entities/roles_has_functions.entity';
import { Roles } from 'src/role/entities/roles.entity';
import { Functions } from 'src/function/entities/functions.entity';
import { AccountModule } from 'src/account/account.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accounts, RoleHasFunctions, Roles, Functions]),
    forwardRef(() => AuthModule)

  ],
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
  exports: [RolePermissionService]
})
export class RolePermissionModule {}
