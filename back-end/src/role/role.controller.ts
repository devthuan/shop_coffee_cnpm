import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { plainToInstance } from 'class-transformer';
import { Roles } from './entities/roles.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { query } from 'express';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { Permissions } from 'src/auth/permission.decorator';
import { PermissionsGuard } from 'src/auth/permisson.guard';

@Controller('role')
@UseGuards(AuthGuardCustom)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(PermissionsGuard)
  @Permissions("CREATE_ROLE")
  @Post('')
  createRole(@Body() createRole : CreateRoleDto) {
    return this.roleService.create(createRole)

  }

  @UseGuards(PermissionsGuard)
  // @Permissions("GET_ROLES")
  @Get('')
  getAllRoles(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query() query: Record<string, any> // Lấy tất cả query params còn lại
  ) {
    const {search : _search, page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;
    limit = limit > 100 ? 100 : limit;

    const data = this.roleService.findAll(search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance( Roles, data);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("DELETE_ROLE")
  @Delete(':id')
  deleteSoftRole(@Param('id') id: string) {
    return this.roleService.deleteSoft(id);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("RECOVER_ROLE")
  @Patch('recover/:id')
  recoverSoftRole(@Param('id') id: string){
    return this.roleService.recover(id);
  }

}
