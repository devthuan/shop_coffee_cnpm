import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { Images } from './entities/images.entity';
import { ProductAttributeValue } from './entities/product_attribute_values.entity';
import { ProductDiscount } from '../discount/entities/product_discount.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { AttributeModule } from 'src/attribute/attribute.module';
import { SubAttributeModule } from 'src/sub-attribute/sub-attribute.module';
import { SubAttributes } from 'src/sub-attribute/entities/sub-attribute.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products, Images, ProductAttributeValue, ProductDiscount, SubAttributes]),
    CategoriesModule,
    AttributeModule,
    SubAttributeModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
