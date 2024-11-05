import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { plainToInstance } from 'class-transformer';
import { GetAttributesDto } from './dto/get-attribute.dto';
import { Attributes } from './entities/attributes.entity';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/auth/permisson.guard';
import { Permissions } from 'src/auth/permission.decorator';

@Controller('attribute')
@UseGuards(AuthGuardCustom)
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @UseGuards(PermissionsGuard)
  @Permissions("CREATE_ATTRIBUTE")
  @Post()
  create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributeService.create(createAttributeDto);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("GET_ATTRIBUTES")
  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page') page: number ,
    @Query('limit') limit: number ,
    @Query('sortBy') sortBy: string ,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC'  =  'ASC',
    @Query() query: Record<string, any>
  
  ) {
    const { search : _search, page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;
    limit = limit > 100 ? limit = 100 : limit;

    const responseDate = this.attributeService.findAll(search, page, limit, sortBy, sortOrder, filters);

    return plainToInstance(Attributes, responseDate)
  }
  @UseGuards(PermissionsGuard)
  @Permissions("VIEW_DELETED_ATTRIBUTES")
  @Get('deleted')
  findAllDeleted(
    @Query('search') search: string,
    @Query('page') page: number ,
    @Query('limit') limit: number ,
    @Query('sortBy') sortBy: string ,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC'  =  'ASC'
  
  ) {
    limit = limit > 100 ? limit = 100 : limit;
    return this.attributeService.findAllDeleted(search, page, limit, sortBy, sortOrder);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("VIEW_ATTRIBUTE")
  @Get(':id')
  findOne(@Param('id') id: string) {
    const responseDate = this.attributeService.findOne(id);
    return plainToInstance(Attributes, responseDate)
  }

  @UseGuards(PermissionsGuard)
  @Permissions("UPDATE_ATTRIBUTE")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttributeDto: UpdateAttributeDto) {
    return this.attributeService.update(id, updateAttributeDto);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("RECOVER_ATTRIBUTE")
  @Patch('recover/:id')
  recover(@Param('id') id: string) {
    return this.attributeService.recover(id);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("DELETE_ATTRIBUTE")
  @Delete(':id')
  deletedSoft(@Param('id') id: string) {
    return this.attributeService.deleteSoft(id);
  }

  
}
