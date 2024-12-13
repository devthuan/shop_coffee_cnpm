import { Body, Controller, Get, Post } from '@nestjs/common';
import { StatisticalService } from './statistical.service';
import { StatisticalDto } from './statistical.dto';

@Controller('statistical')
export class StatisticalController {
  constructor(private readonly statisticalService: StatisticalService) {

  }

  @Get('')
  async getRevenue(): Promise<any> {
    return await this.statisticalService.statistical();
  }

  @Post('revenue-by-date')
  async getRevenueByDate(@Body() statisticalDto: StatisticalDto): Promise<any> {
    return await this.statisticalService.statisticalByDate(statisticalDto);
  }
  @Post('expense-by-date')
  async statisticalExpenseByDate(@Body() statisticalDto: StatisticalDto): Promise<any> {
    return await this.statisticalService.statisticalExpenseByDate(statisticalDto);
  }
  @Post('import-receipt')
  async statisticalImportReceiptByDate(@Body() statisticalDto: StatisticalDto): Promise<any> {
    return await this.statisticalService.statisticalImportReceiptByDate(statisticalDto);
  }
  @Post('billings')
  async statisticalByStatusAndDate(@Body() statisticalDto: StatisticalDto): Promise<any> {
    return await this.statisticalService.statisticalByStatusAndDate(statisticalDto);
  }
  @Post('product')
  async statisticalByProduct(@Body() statisticalDto: StatisticalDto): Promise<any> {
    return await this.statisticalService.statisticalByProduct(statisticalDto);
  }
}
