import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { plainToInstance } from 'class-transformer';
import { Categories } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(
    @Query('search') search : string,
    @Query('page') page: number ,
    @Query('limit') limit: number ,
    @Query('sortBy') sortBy: string ,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    limit > 100 ? limit = 100 : limit;
    const data = this.categoriesService.findAll(search, page, limit, sortBy, sortOrder);
    return plainToInstance(Categories, data)
  }
  @Get('deleted')
  findAllDeleted(
    @Query('search') search : string,
    @Query('page') page: number ,
    @Query('limit') limit: number ,
    @Query('sortBy') sortBy: string ,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    limit > 100 ? limit = 100 : limit;
    return this.categoriesService.findAllDeleted(search, page, limit, sortBy, sortOrder);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
     const data = this.categoriesService.findOne(id);
    return plainToInstance(Categories, data)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }
  @Patch('recover/:id')
  recover(@Param('id') id: string) {
    return this.categoriesService.recover(id);
  }

  @Delete(':id')
  deleteSoft(@Param('id') id: string) {
    return this.categoriesService.deleteSoft(id);
  }
}
