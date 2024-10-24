import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/baseService';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHistory } from './entities/transaction-history.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateTransactionHistoryDto } from './dto/create-transaction-history.dto';
import { CommonException } from 'src/common/exception';

@Injectable()
export class TransactionHistoryService extends BaseService<TransactionHistory> {

  constructor(
    @InjectRepository(TransactionHistory)
    private readonly transactionHistoryRepository: Repository<TransactionHistory>,
    private readonly dataSource: DataSource
  ) {
    super(transactionHistoryRepository);
  }

  async createTransactionHistory(createTransactionHistoryDto: CreateTransactionHistoryDto): Promise<CreateTransactionHistoryDto> {
    const queryRunner = this.dataSource.createQueryRunner()
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction();

      const transactionHistory = this.transactionHistoryRepository.create(createTransactionHistoryDto);
      await queryRunner.manager.save(transactionHistory);
      await queryRunner.commitTransaction();
      
      return createTransactionHistoryDto;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      CommonException.handle(error)
    }finally {
      await queryRunner.release();
    }
  }



  
}
