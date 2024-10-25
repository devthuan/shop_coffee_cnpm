import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RespondInterfacePOST } from 'src/common/interface';
import { CreateRoleDto } from '../role/dto/create-role.dto';
import { createRoleHasFunctions } from './dto/create-role-has-function.dto';
import { DeleteRoleDto } from './dto/delete-role.dto';
import { plainToInstance } from 'class-transformer';
import { RoleHasFunctions } from './entities/roles_has_functions.entity';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/auth/permisson.guard';
import { Permissions } from 'src/auth/permission.decorator';

@Controller('role-permission')
@UseGuards(AuthGuardCustom)
export class RolePermissionController {
  constructor(
    private readonly rolePermissionService: RolePermissionService,
  ) {}


  @UseGuards(PermissionsGuard)
  @Permissions("CREATE_PERMISSION")
  @Post('')
  createRoleHasFunction(@Body() createRoleHasFunctions : createRoleHasFunctions) {
    return this.rolePermissionService.createRoleHasFunctions(createRoleHasFunctions)

  }

  @UseGuards(PermissionsGuard)
  @Permissions("GET_PERMISSION")
  @Get('')
  getRolePermissions() {
    return this.rolePermissionService.getRolePermissions();
  }

  @UseGuards(PermissionsGuard)
  @Permissions("CHANGE_STATUS_PERMISSION")
  @Patch('change-status/:id')
  changeStatusPermission(@Param('id') id: string) { 
    return this.rolePermissionService.changeStatusPermission(id);
  } 

  @UseGuards(PermissionsGuard)
  @Permissions("GET_PERMISSION_BY_ROLE")
  @Get('by-role/:role')
  getRolePermissionsByRole(
    @Param('role') roleCodeName: string
  ) {
    const data =  this.rolePermissionService.getRolePermissionsByRole(roleCodeName);
    return plainToInstance(RoleHasFunctions, data);
  }



  





 


}
