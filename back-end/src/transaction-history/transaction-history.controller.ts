import { Controller, Get,  Param,  Query, UseGuards } from '@nestjs/common';
import { TransactionHistoryService } from './transaction-history.service';
import { plainToInstance } from 'class-transformer';
import { TransactionHistory } from './entities/transaction-history.entity';
import { AuthGuardCustom } from 'src/auth/auth.guard';

@Controller('transaction-history')
@UseGuards(AuthGuardCustom)
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
    @Query() query: Record<string, any>

  ) {
    const { page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;
    limit = limit > 100 ? 100 : limit;
    let data = this.transactionHistoryService.findAll(search, page, limit, sortBy, sortOrder, filters);
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
