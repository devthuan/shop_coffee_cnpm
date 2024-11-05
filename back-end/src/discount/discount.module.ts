import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDiscount } from './entities/product_discount.entity';
import { Products } from 'src/product/entities/products.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductDiscount, Products]),
    AuthModule
  ],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
