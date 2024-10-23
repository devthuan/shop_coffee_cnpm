import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { plainToInstance } from 'class-transformer';
import { Vouchers } from './entities/vouchers.entity';
import { UseVoucherDto } from './dto/use-voucher-dto';
import { AuthGuardCustom } from 'src/auth/auth.guard';

@Controller('vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post()
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.voucherService.create(createVoucherDto);
  }

  

  @Get()
  findAll(
    @Query('search') search : string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    let data=  this.voucherService.findAll(search, page, limit, sortBy, sortOrder);
    return plainToInstance(Vouchers, data)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    let data = this.voucherService.findOne(id);
    return plainToInstance(Vouchers, data)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoucherDto: UpdateVoucherDto) {
    return this.voucherService.update(id, updateVoucherDto);
  }

  @UseGuards(AuthGuardCustom)

  @Patch('use-voucher/:id')
  useVoucher(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    let useVoucherDto = new UseVoucherDto()
      useVoucherDto.accountId = req['user'].id
      useVoucherDto.voucherId = id
    return this.voucherService.usingVouchers(useVoucherDto);
  }

  @Patch('recover/:id')
  recover(@Param('id') id: string) {
    return this.voucherService.recover(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voucherService.deleteSoft(id);
  }
}
