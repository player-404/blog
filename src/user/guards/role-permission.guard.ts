import { Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class RolePermissionGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {}
}
