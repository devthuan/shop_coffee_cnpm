import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventories } from './entities/inventory.entity';
import { Products } from 'src/product/entities/products.entity';
import { Images } from 'src/product/entities/images.entity';
import { ProductAttributes } from 'src/product/entities/productAttributes.entity';
import { Attributes } from 'src/attribute/entities/attributes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventories, Products, Images, ProductAttributes, Attributes])
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
