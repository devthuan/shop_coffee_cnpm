import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query, Put } from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto, UpdateStatusDto } from './dto/update-bill.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { plainToInstance } from 'class-transformer';
import { Bills } from './entities/bill.entity';
import { CommonException } from 'src/common/exception';

@Controller('bills')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Req() request: Request,
    @Body() createBillDto: CreateBillDto
  ) {
    createBillDto.accountId = request['user'].id; 

    return this.billService.create(createBillDto);
  }

  @Get()
  findAll(
    @Query('search') search : string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) {
    let data = this.billService.findAll(search, page, limit, sortBy, sortOrder);
    return plainToInstance(Bills, data)
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    let data = this.billService.findOne(id);
    return plainToInstance(Bills, data)
    
  }


  

  @Patch('update-status/:id')
  update(@Param('id') id: string,@Body() updateStatusDto :UpdateStatusDto ) {
    return this.billService.updateStatus(id, updateStatusDto.status);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.billService.(id);
  // }
}
