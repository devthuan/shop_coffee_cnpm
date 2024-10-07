import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bills } from './entities/bill.entity';
import { BillDetails } from './entities/bill-detail.entity';
import { ProductAttributes } from 'src/product/entities/productAttributes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bills, BillDetails, ProductAttributes])
  ],
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {}
