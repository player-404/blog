import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { RoleService } from '@/role/role.service';

@Injectable()
export class ValidateRolesIdGuard implements CanActivate {
  constructor(private readonly roleService: RoleService) {}
  async canActivate(context: ExecutionContext) {
    console.log('roles gurad');
    const requests = context.switchToHttp().getRequest<Request>();
    const rolesid =
      (requests.body as unknown as { roles: string[] }).roles || '';
    if (!rolesid) return true;
    const exits = await this.roleService.findExits(rolesid);
    console.log('exits', exits, 'roles', rolesid);
    if (!(rolesid.length == exits.length)) {
      throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST);
    } else {
      return true;
    }
  }
}
