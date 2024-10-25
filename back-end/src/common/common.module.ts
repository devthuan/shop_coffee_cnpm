import { forwardRef, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { BillModule } from 'src/bill/bill.module';

@Module({
  imports: [
  ],
  controllers: [CommonController],
  providers: [CommonService],
  
})
export class CommonModule {}
