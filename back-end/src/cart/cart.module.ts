import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Products } from 'src/product/entities/products.entity';
import { ProductAttributes } from 'src/product/entities/productAttributes.entity';
import { Accounts } from 'src/auth/entities/accounts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Products, ProductAttributes, Accounts])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService]   
})
export class CartModule {}
