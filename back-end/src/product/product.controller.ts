import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { Products } from './entities/products.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  createProduct(@UploadedFiles() files: Array<Express.Multer.File>, @Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(files, createProductDto);
  }

  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: "ASC" | "DESC" = "DESC",

  ) {
    limit = limit > 100 ? 100 : limit;
    let data = this.productService.findAll(search, page, limit, sortBy, sortOrder);
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

  @Patch(':id')
  updateProduct(@UploadedFiles() files: Array<Express.Multer.File>, @Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id,files, updateProductDto);
  }
  @Patch('recover/:id')
  recover( @Param('id') id: string) {
    return this.productService.recover(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.deleteSoft(id);
  }

  // @Post('upload')
  // @UseInterceptors(FilesInterceptor('files'))
  // uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
  //   return this.productService.uploadFileCloudinary(files[0]);
  // }
}
