import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateDetailSupplier, CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { plainToInstance } from 'class-transformer';
import { Supplier } from './entities/supplier.entity';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/auth/permisson.guard';
import { Permissions } from 'src/auth/permission.decorator';

@Controller('supplier')
@UseGuards(AuthGuardCustom)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @UseGuards(PermissionsGuard)
  @Permissions("CREATE_SUPPLIER")
  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.createSupplier(createSupplierDto);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("GET_SUPPLIER_DETAIL")
  @Post('detail-supplier')
  addDetailSupplier(@Body() createDetailSupplier: CreateDetailSupplier) {
    return this.supplierService.addDetailSupplier(createDetailSupplier);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("GET_SUPPLIERS")
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
    const data = this.supplierService.findAll(search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance(Supplier, data)
  }

  @UseGuards(PermissionsGuard)
  @Permissions("GET_DELETED_SUPPLIERS")
  @Get('deleted')
  findAllDeleted(
    @Query('search') search : string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query() query: Record<string, any>

  )
  {
    const { page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;
    limit = limit > 100 ? 100 : limit;
    return this.supplierService.findAllDeleted(search, page, limit, sortBy, sortOrder);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("GET_SUPPLIER_BY_ID")
  @Get(':id')
  findOne(@Param('id') id: string) {
    const data = this.supplierService.getDetailSupplier(id);
    return plainToInstance(Supplier, data)
  }

  @UseGuards(PermissionsGuard)
  @Permissions("UPDATE_SUPPLIER")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.supplierService.updateSupplier(id, updateSupplierDto);
  }
  
  @UseGuards(PermissionsGuard)
  @Permissions("RECOVER_SUPPLIER")
  @Patch('recover/:id')
  recover(@Param('id') id: string) {
    return this.supplierService.recover(id);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("DELETE_SUPPLIER")
  @Delete(':id')
  deletedSoft(@Param('id') id: string) {
    return this.supplierService.deleteSoft(id);
  }
  
   @UseGuards(PermissionsGuard)
  @Permissions("DELETE_SUPPLIER_DETAIL")
  @Delete('detail/:id')
  deletedSoftDetail(@Param('id') id: string) {
    return this.supplierService.deleteSoftDetailSupplier(id);
  }
}
