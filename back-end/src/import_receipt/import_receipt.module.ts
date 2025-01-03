import { forwardRef, Module } from '@nestjs/common';
import { ImportReceiptService } from './import_receipt.service';
import { ImportReceiptController } from './import_receipt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportReceipts } from './entities/import_receipt.entity';
import { ImportReceiptDetail } from './entities/import_receipt_detail.entity';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { SupplierModule } from 'src/supplier/supplier.module';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImportReceipts, ImportReceiptDetail, Accounts]),
    forwardRef(() => ProductModule),
    forwardRef(() => SupplierModule),
    AuthModule
  ],
  controllers: [ImportReceiptController],
  providers: [ImportReceiptService],
  exports: [ImportReceiptService]  
})
export class ImportReceiptModule {}
