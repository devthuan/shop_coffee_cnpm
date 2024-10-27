import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query, Put } from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto, UpdateStatusDto } from './dto/update-bill.dto';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { plainToInstance } from 'class-transformer';
import { Bills } from './entities/bill.entity';
import { CommonException } from 'src/common/exception';
import { Permissions } from 'src/auth/permission.decorator';
import { PermissionsGuard } from 'src/auth/permisson.guard';

@Controller('bills')
@UseGuards(AuthGuardCustom)
export class BillController {
  constructor(private readonly billService: BillService) {}

  @UseGuards(PermissionsGuard)
  @Permissions("CREATE_BILL")
  @Post()
  create(
    @Req() request: Request,
    @Body() createBillDto: CreateBillDto
  ) {
    createBillDto.accountId = request['user'].id; 

    return this.billService.create(createBillDto);
  }

   @UseGuards(PermissionsGuard)
  @Permissions("GET_BILLS")
  @Get()
  findAll(
    @Query('search') search : string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query() query: Record<string, any>

  ) {
    const {search : _search, page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;
    limit = limit > 100 ? limit = 100 : limit;
    let data = this.billService.findAll(search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance(Bills, data)
  }
  @UseGuards(PermissionsGuard)
  @Permissions("GET_BILLS_BY_ACCOUNT")
  @Get('account')
  findAllByAccount(
    @Req() request: Request,
    @Query('search') search : string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query() query: Record<string, any>
  ) {
    const { search : _search, page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;
    limit = limit > 100 ? limit = 100 : limit;
    let accountId = request['user'].id;  // get accountId from token
    let data = this.billService.getBillByAccount(accountId,search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance(Bills, data)
  }
  
  @UseGuards(PermissionsGuard)
  @Permissions("GET_BILL_BY_ID")
  @Get(':id')
  findOne(@Param('id') id: string) {
    let data = this.billService.findOne(id);
    return plainToInstance(Bills, data)
    
  }


  
  @UseGuards(PermissionsGuard)
  @Permissions("UPDATE_BILL")
  @Patch('update-status/:id')
  update(@Param('id') id: string,@Body() updateStatusDto :UpdateStatusDto ) {
    return this.billService.updateStatus(id, updateStatusDto.status);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.billService.(id);
  // }
}
