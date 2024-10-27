import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { Permissions } from 'src/auth/permission.decorator';
import { PermissionsGuard } from 'src/auth/permisson.guard';

@Controller('inventory')
@UseGuards(AuthGuardCustom)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // @UseGuards(PermissionsGuard)
  // @Permissions("UPDATE_IMPORT_RECEIPT_STATUS")
  // @Post()
  // create(@Body() createInventoryDto: CreateInventoryDto) {
  //   return this.inventoryService.create(createInventoryDto);
  // }

  @UseGuards(PermissionsGuard)
  @Permissions("GET_INVENTORY")
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
    limit > 100 ? limit = 100 : limit
    return this.inventoryService.findAll(search, page, limit, sortBy, sortOrder, filters);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.inventoryService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
  //   return this.inventoryService.update(+id, updateInventoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.inventoryService.remove(+id);
  // }
}
