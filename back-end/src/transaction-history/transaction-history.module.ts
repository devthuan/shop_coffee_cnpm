import { Module } from '@nestjs/common';
import { TransactionHistoryService } from './transaction-history.service';
import { TransactionHistoryController } from './transaction-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionHistory } from './entities/transaction-history.entity';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionHistory, Accounts]),
  AuthModule
],
  controllers: [TransactionHistoryController],
  providers: [TransactionHistoryService],
})
export class TransactionHistoryModule {}
