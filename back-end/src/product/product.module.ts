import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { Categories } from './entities/category.entity';
import { Attributes } from './entities/attributes.entity';
import { Images } from './entities/images.entity';
import { Reviews } from './entities/review.entity';
import { ProductAttributes } from './entities/product_attributes.entity';
import { ProductDiscount } from './entities/product_discount.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products, Categories, Attributes, Images, Reviews, ProductAttributes, ProductDiscount])
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
