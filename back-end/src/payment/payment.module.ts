import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payments } from './entities/payment.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payments]),
    AuthModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],  
})
export class PaymentModule {}
