import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDiscount } from './entities/product_discount.entity';
import { Products } from 'src/product/entities/products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductDiscount, Products])
  ],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
