import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { RoleHasFunctions } from 'src/role-permission/entities/roles_has_functions.entity';
import { Roles } from 'src/role/entities/roles.entity';
import { Functions } from 'src/function/entities/functions.entity';
import { AuthModule } from 'src/auth/auth.module';
import { BillModule } from 'src/bill/bill.module';
import { Products } from 'src/product/entities/products.entity';
import { Categories } from 'src/categories/entities/category.entity';
import { Vouchers } from 'src/voucher/entities/vouchers.entity';
import { Attributes } from 'src/attribute/entities/attributes.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Payments } from 'src/payment/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accounts, Roles, Functions, RoleHasFunctions, Categories, Vouchers, Attributes, Supplier, Payments]),
 
  ],
  controllers: [SeederController],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
