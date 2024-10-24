import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vouchers } from './entities/vouchers.entity';
import { UseVouchers } from './entities/use-voucher.entity';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vouchers, UseVouchers, Accounts]),
    AuthModule
  ],
  controllers: [VoucherController],
  providers: [VoucherService],
  exports: [VoucherService]  
})
export class VoucherModule {}
