import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RespondInterfacePOST } from 'src/common/interface';
import { CreateRoleDto } from '../role/dto/create-role.dto';
import { createRoleHasFunctions } from './dto/create-role-has-function.dto';
import { DeleteRoleDto } from './dto/delete-role.dto';
import { plainToInstance } from 'class-transformer';
import { RoleHasFunctions } from './entities/roles_has_functions.entity';

@Controller('role-permission')
export class RolePermissionController {
  constructor(
    private readonly rolePermissionService: RolePermissionService,
  ) {}

  @Post('')
  createRoleHasFunction(@Body() createRoleHasFunctions : createRoleHasFunctions) {
    return this.rolePermissionService.createRoleHasFunctions(createRoleHasFunctions)

  }

  
  @Get('')
  getRolePermissions() {
    return this.rolePermissionService.getRolePermissions();
  }

  @Patch('change-status/:id')
  changeStatusPermission(@Param('id') id: string) { 
    return this.rolePermissionService.changeStatusPermission(id);
  }

  @Get('by-role/:role')
  getRolePermissionsByRole(
    @Param('role') roleCodeName: string
  ) {
    const data =  this.rolePermissionService.getRolePermissionsByRole(roleCodeName);
    return plainToInstance(RoleHasFunctions, data);
  }



  





 


}
