import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UploadedFiles, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { Products } from './entities/products.entity';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/auth/permisson.guard';
import { Permissions } from 'src/auth/permission.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("CREATE_PRODUCT")
  @Post()
  createProduct( @Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: "ASC" | "DESC" = "DESC",
    @Query() query: Record<string, any>

  ) {
    const {search : _search, page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;
    limit = limit > 100 ? 100 : limit;
    let data = this.productService.findAll(search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance(Products, data)
  }
  @Get('client')
  findAllForClient(
    @Query('search') search: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: "ASC" | "DESC" = "DESC",
    @Query() query: Record<string, any>

  ) {
    const {search : _search, page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;
    limit = limit > 100 ? 100 : limit;
    let data = this.productService.findAllForClient(search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance(Products, data)
  }

  @Get('detail/:id')
  detailProduct(@Param('id') id: string) {
    let data = this.productService.detailProduct(id);
    return plainToInstance(Products, data)
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("UPDATE_PRODUCT")
  @Patch(':id')
  updateProduct( @Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("RECOVER_PRODUCT")
  @Patch('recover/:id')
  recover( @Param('id') id: string) {
    return this.productService.recover(id);
  }

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("DELETE_PRODUCT")
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.deleteSoft(id);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.productService.uploadFileCloudinary(files[0]);
  }
}
