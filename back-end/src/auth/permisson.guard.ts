import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permission.decorator';
import { AuthService } from './auth.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,

) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredPermissions) {
          return true;
    }
    const { user } = context.switchToHttp().getRequest();

    // Lấy quyền dựa trên vai trò của user
    const rolePermissions = await this.authService.getPermissionByRole(user.role);

    // Kiểm tra xem có bất kỳ quyền nào của user khớp với requiredPermissions hay không
    return rolePermissions.some(item => 
      requiredPermissions.some(permission => 
        item.functions.codeName?.includes(permission)
      )
    );
  }

  


}
