import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventories } from './entities/inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventories])
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
