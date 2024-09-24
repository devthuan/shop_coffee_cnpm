import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RespondInterfacePOST } from 'src/common/interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateFunctionDto } from './dto/create-function.dto';
import { createRoleHasFunctions } from './dto/create-role-has-function.dto';
import { DeleteRoleDto } from './dto/delete-role.dto';
import { RoleService } from './role.service';
import { FunctionsService } from './function.service';
import { plainToInstance } from 'class-transformer';
import { Roles } from './entities/roles.entity';
import { Functions } from './entities/functions.entity';

@Controller('role-permission')
export class RolePermissionController {
  constructor(
    private readonly rolePermissionService: RolePermissionService,
    private readonly roleService: RoleService,
    private readonly functionService: FunctionsService
  ) {}

  @Post('')
  createRoleHasFunction(@Body() createRoleHasFunctions : createRoleHasFunctions) {
    return this.rolePermissionService.createRoleHasFunctions(createRoleHasFunctions)

  }

  
  @Get('')
  getRolePermissions() {
    return this.rolePermissionService.getRolePermissions();
  }



  @Post('roles')
  createRole(@Body() createRole : CreateRoleDto) {
    return this.roleService.create(createRole)

  }

  @Get('roles')
  getAllRoles(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) {

    const data = this.roleService.findAll(search, page, limit, sortBy, sortOrder);
    return plainToInstance( Roles, data);
  }

  @Delete('roles/:id')
  deleteSoftRole(@Param('id') id: string) {
    return this.roleService.deleteSoft(id);
  }

  @Patch('roles/recover/:id')
  recoverSoftRole(@Param('id') id: string){
    return this.roleService.recover(id);
  }


  
  @Post('functions')
  createFunctions(@Body() createFunction : CreateFunctionDto) {
    return this.functionService.create(createFunction)

  }
  
  @Get('functions')
  getAllFunctions(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) {
    const data = this.functionService.findAll(search, page, limit, sortBy, sortOrder);
    return plainToInstance( Functions, data);
  }

  @Patch('functions/recover/:id')
  recoverSoftFunction(@Param('id') id: string){
    return this.functionService.recover(id);
  }
  
  @Delete('functions/:id')
  deleteSoftFunction(@Param('id') id: string) {
    return this.functionService.deleteSoft(id);
  }



 


}
