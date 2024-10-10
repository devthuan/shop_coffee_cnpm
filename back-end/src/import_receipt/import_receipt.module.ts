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

@Module({
  imports: [
    TypeOrmModule.forFeature([ImportReceipts, ImportReceiptDetail, Accounts]),
    SupplierModule,
    // forwardRef( () => ProductModule),
    ProductModule
  ],
  controllers: [ImportReceiptController],
  providers: [ImportReceiptService],
})
export class ImportReceiptModule {}
