import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { DetailSupplier } from './entities/detail-supplier.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier, DetailSupplier]),
    ProductModule
  ],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
