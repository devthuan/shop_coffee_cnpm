import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { plainToInstance } from 'class-transformer';
import { ProductDiscount } from './entities/product_discount.entity';
import { CommonException } from 'src/common/exception';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  create(@Body() createDiscountDto: CreateDiscountDto) {
    try {
      // validate startDate and endDate
      const currentDate = new Date();
      if (createDiscountDto.startDate < currentDate) {
        throw new BadRequestException('Start date must be in the future.');
      }
      if (createDiscountDto.endDate < createDiscountDto.startDate) {
        throw new BadRequestException('End date must be after start date.');
      }
  
      return this.discountService.create(createDiscountDto);
      
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        console.error('Error occurred:', error); 
        throw new InternalServerErrorException('An unexpected error occurred.');
      }
    }
  }

  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query() query: Record<string, any>

  ) {

    const { page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;


    limit > 100 ? limit = 100 : limit;
    const responseData = this.discountService.findAll(search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance(ProductDiscount, responseData)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const responseData = this.discountService.findOne(id);
    return plainToInstance(ProductDiscount, responseData)

  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Patch('recover/:id')
  recover(@Param('id') id: string){
    return this.discountService.recover(id);
  }


  @Delete(':id')
  deleteSoft(@Param('id') id: string) {
    return this.discountService.deleteSoft(id);
  }
}
