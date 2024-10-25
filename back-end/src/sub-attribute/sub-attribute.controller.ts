import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubAttributeService } from './sub-attribute.service';
import { CreateSubAttributeDto } from './dto/create-sub-attribute.dto';
import { UpdateSubAttributeDto } from './dto/update-sub-attribute.dto';

@Controller('sub-attribute')
export class SubAttributeController {
  constructor(private readonly subAttributeService: SubAttributeService) {}

  @Post()
  create(@Body() createSubAttributeDto: CreateSubAttributeDto) {
    return this.subAttributeService.create(createSubAttributeDto);
  }

  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page') page: number ,
    @Query('limit') limit: number ,
    @Query('sortBy') sortBy: string ,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC'  =  'ASC'
  ) {
    return this.subAttributeService.findAll(search, page, limit, sortBy, sortOrder );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subAttributeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubAttributeDto: UpdateSubAttributeDto) {
    return this.subAttributeService.update(id, updateSubAttributeDto);
  }

  @Delete(':id')
  deleteSoft(@Param('id') id: string) {
    return this.subAttributeService.deleteSoft(id);
  }
}
