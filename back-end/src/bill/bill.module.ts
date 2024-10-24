import { forwardRef, Module } from '@nestjs/common';
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
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bills, BillDetails, ProductAttributes, Accounts]),
    VoucherModule,
    PaymentModule,
    CartModule,
    forwardRef(()=> ProductModule),
    
  ],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService]
})
export class BillModule {}
