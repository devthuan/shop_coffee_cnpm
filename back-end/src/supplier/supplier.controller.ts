import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { plainToInstance } from 'class-transformer';
import { Supplier } from './entities/supplier.entity';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }

  @Get()
  findAll(
    @Query('search') search : string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',

  ) {
    const data = this.supplierService.findAll(search, page, limit, sortBy, sortOrder);
    return plainToInstance(Supplier, data)
  }

  @Get('deleted')
  findAllDeleted(
    @Query('search') search : string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  )
  {
    return this.supplierService.findAllDeleted(search, page, limit, sortBy, sortOrder);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const data = this.supplierService.findOne(id);
    return plainToInstance(Supplier, data)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.supplierService.update(id, updateSupplierDto);
  }
  
  @Patch('recover/:id')
  recover(@Param('id') id: string) {
    return this.supplierService.recover(id);
  }

  @Delete(':id')
  deletedSoft(@Param('id') id: string) {
    return this.supplierService.deleteSoft(id);
  }
}