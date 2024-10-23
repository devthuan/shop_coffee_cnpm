import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { plainToInstance } from 'class-transformer';
import { Roles } from './entities/roles.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('')
  createRole(@Body() createRole : CreateRoleDto) {
    return this.roleService.create(createRole)

  }

  @Get('')
  getAllRoles(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query() filters: Record<string, any> // Lấy tất cả query params còn lại
  ) {
    console.log(filters)

    const data = this.roleService.findAll(search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance( Roles, data);
  }

  @Delete(':id')
  deleteSoftRole(@Param('id') id: string) {
    return this.roleService.deleteSoft(id);
  }

  @Patch('recover/:id')
  recoverSoftRole(@Param('id') id: string){
    return this.roleService.recover(id);
  }

}
