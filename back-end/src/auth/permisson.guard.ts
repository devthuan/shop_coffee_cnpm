import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permission.decorator';
import { RolePermissionService } from 'src/role-permission/role-permission.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    
    
) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredPermissions) {
          return true;
        }
    const { user } = context.switchToHttp().getRequest();
    console.log(user) 
    // const listPermission = this.rolePermissionService.getRolePermissionsByRole(user.role)
    return true
    // return requiredPermissions.some((permission) => user.permissions?.includes(permission));
  }
}
