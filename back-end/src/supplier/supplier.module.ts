import { forwardRef, Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { DetailSupplier } from './entities/detail-supplier.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier, DetailSupplier]),
    
    forwardRef(() => ProductModule)
  ],
  controllers: [SupplierController],
  providers: [SupplierService],
  exports: [SupplierService]
})
export class SupplierModule {}
