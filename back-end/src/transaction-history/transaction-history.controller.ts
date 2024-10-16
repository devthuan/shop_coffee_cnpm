import { Controller, Get,  Param,  Query, UseGuards } from '@nestjs/common';
import { TransactionHistoryService } from './transaction-history.service';
import { plainToInstance } from 'class-transformer';
import { TransactionHistory } from './entities/transaction-history.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('transaction-history')
@UseGuards(AuthGuard)
export class TransactionHistoryController {
  constructor(private readonly transactionHistoryService: TransactionHistoryService) {}

  // @Post()
  // create(@Req() req: Request, @Body() createTransactionHistoryDto: CreateTransactionHistoryDto) {
  //   createTransactionHistoryDto.accountId = req['user'].accountId;
  //   return this.transactionHistoryService.create(createTransactionHistoryDto);
  // }

  @Get()
  findAll(
    @Query('search') search : string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    let data = this.transactionHistoryService.findAll(search, page, limit, sortBy, sortOrder);
    return plainToInstance(TransactionHistory, data)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionHistoryService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTransactionHistoryDto: UpdateTransactionHistoryDto) {
  //   return this.transactionHistoryService.update(id, updateTransactionHistoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.transactionHistoryService.deleteSoft(id);
  // }
}