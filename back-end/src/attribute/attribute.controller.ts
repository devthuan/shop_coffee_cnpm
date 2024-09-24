import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { plainToInstance } from 'class-transformer';
import { GetAttributesDto } from './dto/get-attribute.dto';
import { Attributes } from './entities/attributes.entity';

@Controller('attribute')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributeService.create(createAttributeDto);
  }

  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page') page: number ,
    @Query('limit') limit: number ,
    @Query('sortBy') sortBy: string ,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC'  =  'ASC'
  
  ) {
    const responseDate = this.attributeService.findAll(search, page, limit, sortBy, sortOrder);

    return plainToInstance(Attributes, responseDate)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const responseDate = this.attributeService.findOne(id);
    return plainToInstance(Attributes, responseDate)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttributeDto: UpdateAttributeDto) {
    return this.attributeService.update(id, updateAttributeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeService.deleteSoft(id);
  }
}
