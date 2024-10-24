import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { plainToInstance } from 'class-transformer';
import { Vouchers } from './entities/vouchers.entity';
import { UseVoucherDto } from './dto/use-voucher-dto';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/auth/permisson.guard';
import { Permissions } from 'src/auth/permission.decorator';

@Controller('vouchers')
@UseGuards(AuthGuardCustom)
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @UseGuards(PermissionsGuard)
  @Permissions("CREATE_VOUCHER")
  @Post()
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.voucherService.create(createVoucherDto);
  }

  
  @UseGuards(PermissionsGuard)
  @Permissions("GET_VOUCHERS")
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
    let data=  this.voucherService.findAll(search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance(Vouchers, data)
  }

  @UseGuards(PermissionsGuard)
  @Permissions("GET_VOUCHER_BY_ID")
  @Get(':id')
  findOne(@Param('id') id: string) {
    let data = this.voucherService.findOne(id);
    return plainToInstance(Vouchers, data)
  }

  @UseGuards(PermissionsGuard)
  @Permissions("UPDATE_VOUCHER")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoucherDto: UpdateVoucherDto) {
    return this.voucherService.update(id, updateVoucherDto);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("USE_VOUCHER")
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

  @UseGuards(PermissionsGuard)
  @Permissions("RECOVER_VOUCHER")
  @Patch('recover/:id')
  recover(@Param('id') id: string) {
    return this.voucherService.recover(id);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("DELETE_VOUCHER")
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voucherService.deleteSoft(id);
  }
}
