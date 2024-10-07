import { Injectable } from '@nestjs/common';
import { Payments } from './entities/payment.entity';
import { BaseService } from 'src/common/baseService';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService extends BaseService<Payments> {
  constructor(
    @InjectRepository(Payments)
    private readonly paymentRepository: Repository<Payments>, 
  ) {
    super(paymentRepository);
  }
}
