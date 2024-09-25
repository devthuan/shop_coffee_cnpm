import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { Images } from './entities/images.entity';
import { Reviews } from '../reviews/entities/review.entity';
import { ProductAttributes } from './entities/product_attributes.entity';
import { ProductDiscount } from '../discount/entities/product_discount.entity';
import { Attributes } from 'src/attribute/entities/attributes.entity';
import { Categories } from 'src/categories/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products, Categories, Attributes, Images, Reviews, ProductAttributes, ProductDiscount])
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
