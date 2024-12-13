import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { plainToInstance } from 'class-transformer';
import { Categories } from './entities/category.entity';
import { Permissions } from 'src/auth/permission.decorator';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/auth/permisson.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("CREATE_CATEGORY")
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
    @Query() query: Record<string, any>

  ) {
    const { page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;

    limit > 100 ? limit = 100 : limit;
    const data = this.categoriesService.findAll(search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance(Categories, data)
  }
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("VIEW_DELETED_CATEGORIES")
  @Get('deleted')
  findAllDeleted(
    @Query('search') search : string,
    @Query('page') page: number ,
    @Query('limit') limit: number ,
    @Query('sortBy') sortBy: string ,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
    @Query() query: Record<string, any>

  ) {
    const { search : _search, page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;

    limit = limit > 100 ? limit = 100 : limit;
    return this.categoriesService.findAllDeleted(search, page, limit, sortBy, sortOrder, filters);
  }

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("VIEW_CATEGORY")
  @Get(':id')
  findOne(@Param('id') id: string) {
     const data = this.categoriesService.findOne(id);
    return plainToInstance(Categories, data)
  }

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("UPDATE_CATEGORY")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("RECOVER_CATEGORY")
  @Patch('recover/:id')
  recover(@Param('id') id: string) {
    return this.categoriesService.recover(id);
  }

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("DELETE_CATEGORY")
  @Delete(':id')
  deleteSoft(@Param('id') id: string) {
    return this.categoriesService.deleteSoft(id);
  }
}
