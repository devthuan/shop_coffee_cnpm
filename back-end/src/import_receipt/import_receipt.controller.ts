import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { ImportReceiptService } from './import_receipt.service';
import { CreateImportReceiptDto } from './dto/create-import_receipt.dto';
import { StatusImportReceiptDto, UpdateImportReceiptDto } from './dto/update-import_receipt.dto';
import { plainToInstance } from 'class-transformer';
import { ImportReceipts } from './entities/import_receipt.entity';
import { AuthGuardCustom } from 'src/auth/auth.guard';

@Controller('import-receipt')
export class ImportReceiptController {
  constructor(private readonly importReceiptService: ImportReceiptService) {}

  @UseGuards(AuthGuardCustom)
  @Post()
  create(@Req() request: Request, @Body() createImportReceiptDto: CreateImportReceiptDto) {
    createImportReceiptDto.accountId = request['user'].id;
    return this.importReceiptService.create(createImportReceiptDto);
  }

  @Get()
  findAll(
    @Query('search') search : string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
     
    let data = this.importReceiptService.findAll(search, page, limit, sortBy, sortOrder);
    return plainToInstance(ImportReceipts, data)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importReceiptService.findOne(id);
  }

  @Get('detail/:id')
  detailImportReceipt(@Param('id') id: string) {
    return this.importReceiptService.detailImportReceipt(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateImportReceiptDto: UpdateImportReceiptDto) {
  //   return this.importReceiptService.update(id, updateImportReceiptDto);
  // }
  @UseGuards(AuthGuardCustom)
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
