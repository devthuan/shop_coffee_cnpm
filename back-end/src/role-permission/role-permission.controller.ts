import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RespondInterfacePOST } from 'src/common/interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateFunctionDto } from './dto/create-function.dto';
import { createRoleHasFunctions } from './dto/create-role-has-function.dto';
import { DeleteRoleDto } from './dto/delete-role.dto';

@Controller('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post('')
  createRoleHasFunction(@Body() createRoleHasFunctions : createRoleHasFunctions) {
    return this.rolePermissionService.createRoleHasFunctions(createRoleHasFunctions)

  }


  @Post('roles')
  createRole(@Body() createRole : CreateRoleDto) {
    return this.rolePermissionService.createRoles(createRole)

  }

  @Post('functions')
  createFunctions(@Body() createFunction : CreateFunctionDto) {
    return this.rolePermissionService.createFunctions(createFunction)

  }
  

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

  @Delete('roles')
  deleteSoftRole(@Body() codeNameRole: DeleteRoleDto) {
    return this.rolePermissionService.deleteSoftRole(codeNameRole.nameCode);
  }

  @Delete('functions')
  deleteSoftFunction(@Body() codeNameFunction: DeleteRoleDto) {
    return this.rolePermissionService.deleteSoftFunction(codeNameFunction.nameCode);
  }


 


}
