import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bills } from './entities/bill.entity';
import { BillDetails } from './entities/bill-detail.entity';
import { ProductAttributes } from 'src/product/entities/productAttributes.entity';
import { VoucherModule } from 'src/voucher/voucher.module';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { ProductModule } from 'src/product/product.module';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bills, BillDetails, ProductAttributes, Accounts]),
    VoucherModule,
    ProductModule,
    PaymentModule
  ],
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {}
