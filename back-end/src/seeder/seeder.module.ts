import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { Roles } from 'src/role-permission/entities/roles.entity';
import { Functions } from 'src/role-permission/entities/functions.entity';
import { RoleHasFunctions } from 'src/role-permission/entities/roles_has_functions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accounts, Roles, Functions, RoleHasFunctions])
  ],
  controllers: [SeederController],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
