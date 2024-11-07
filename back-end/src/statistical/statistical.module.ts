import { Module } from '@nestjs/common';
import { StatisticalService } from './statistical.service';
import { StatisticalController } from './statistical.controller';
import { ProductModule } from 'src/product/product.module';
import { BillModule } from 'src/bill/bill.module';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/product/entities/products.entity';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { Bills } from 'src/bill/entities/bill.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products, Accounts, Bills])
  

  ],
  exports: [StatisticalService],  // Make StatisticalService available to other modules
  controllers: [StatisticalController],
  providers: [StatisticalService],
})
export class StatisticalModule {}
