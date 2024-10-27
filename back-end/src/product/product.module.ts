import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { Images } from './entities/images.entity';
import { ProductAttributes } from './entities/productAttributes.entity';
import { ProductDiscount } from '../discount/entities/product_discount.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { AttributeModule } from 'src/attribute/attribute.module';
import { BillModule } from 'src/bill/bill.module';
import { ImportReceiptModule } from 'src/import_receipt/import_receipt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products, Images, ProductAttributes, ProductDiscount]),
    CategoriesModule,
    AttributeModule,
    forwardRef(()=> BillModule),
    forwardRef(()=> ImportReceiptModule)
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports:[ProductService]
})
export class ProductModule {}
