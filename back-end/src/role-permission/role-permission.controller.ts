import { Controller, Get } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RespondInterfacePOST } from 'src/common/interface';

@Controller('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}


  @Get('')
  getRolePermissions() {
    return this.rolePermissionService.getRolePermissions();
  }

  @Get('roles')
  getAllRoles() {
    return this.rolePermissionService.getAllRoles();
  }

  @Get('functions')
  getAllFunctions() {
    return this.rolePermissionService.getAllFunctions();
  }

 


}
