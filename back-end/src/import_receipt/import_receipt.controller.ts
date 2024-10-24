import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { ImportReceiptService } from './import_receipt.service';
import { CreateImportReceiptDto } from './dto/create-import_receipt.dto';
import { StatusImportReceiptDto, UpdateImportReceiptDto } from './dto/update-import_receipt.dto';
import { plainToInstance } from 'class-transformer';
import { ImportReceipts } from './entities/import_receipt.entity';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { Permissions } from 'src/auth/permission.decorator';
import { PermissionsGuard } from 'src/auth/permisson.guard';

@Controller('import-receipt')
@UseGuards(AuthGuardCustom)
export class ImportReceiptController {
  constructor(private readonly importReceiptService: ImportReceiptService) {}

  @UseGuards(PermissionsGuard)
  @Permissions("CREATE_IMPORT_RECEIPT")
  @Post()
  create(@Req() request: Request, @Body() createImportReceiptDto: CreateImportReceiptDto) {
    createImportReceiptDto.accountId = request['user'].id;
    return this.importReceiptService.create(createImportReceiptDto);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("GET_IMPORT_RECEIPTS")
  @Get()
  findAll(
    @Query('search') search : string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query() query: Record<string, any>

  ) {

    const { page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;
    limit > 100 ? limit = 100 : limit

    let data = this.importReceiptService.findAll(search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance(ImportReceipts, data)
  }

  @UseGuards(PermissionsGuard)
  @Permissions("GET_IMPORT_RECEIPT_BY_ID")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importReceiptService.findOne(id);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("GET_IMPORT_RECEIPT_DETAIL")
  @Get('detail/:id')
  detailImportReceipt(@Param('id') id: string) {
    return this.importReceiptService.detailImportReceipt(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateImportReceiptDto: UpdateImportReceiptDto) {
  //   return this.importReceiptService.update(id, updateImportReceiptDto);
  // }
  @UseGuards(PermissionsGuard)
  @Permissions("UPDATE_IMPORT_RECEIPT_STATUS")
  @Patch('status/:id')
  updateStatusBill(@Req() request: Request, @Param('id') id: string, @Body() statusImportReceiptDto: StatusImportReceiptDto) {
    statusImportReceiptDto.accountId = request['user'].id;
    return this.importReceiptService.updateStatusBill(id, statusImportReceiptDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.importReceiptService.deleteSoft(id);
  // }
}
