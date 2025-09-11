import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY, ROLES_KEY } from '@/enum/permission.enum';
import { UserService } from '@/user/user.service';
import { UserDto } from '@/user/user.dto';
import { CreatePermissionDto } from '@/permission/dto/create-permission.dto';

interface Role {
  permission: [];
}

// 获取 Roles
function getRoles(reflector: Reflector, context: ExecutionContext) {
  let classRoles = reflector.get<string | string[]>(
    ROLES_KEY,
    context.getClass() || [],
  );
  classRoles = classRoles instanceof Array ? [...classRoles] : [classRoles];
  let handleRoles =
    reflector.get<string | string[]>(ROLES_KEY, context.getHandler()) || [];
  handleRoles = handleRoles instanceof Array ? [...handleRoles] : [handleRoles];
  return [...classRoles, ...handleRoles];
}

// 获取 Permission
function getPermission(reflector: Reflector, context: ExecutionContext) {
  const handlePermission = reflector.getAllAndOverride<string | string[]>(
    PERMISSION_KEY,
    [context.getHandler()],
  );

  return handlePermission instanceof Array
    ? handlePermission
    : [handlePermission];
}

// 组合 请求需要的权限
function setGuardPermission(roles: string[], permission: string[]) {
  return roles.flatMap((role) => permission.map((per) => `${role}:${per}`));
}

//检查是否有权限进行访问
function checkPermission(
  guardPermission: string[],
  userPemissions: CreatePermissionDto[],
) {
  const userPermissions = userPemissions.flatMap((per) => per.name);
  const setArr = new Set(userPermissions);
  return guardPermission.every((per) => setArr.has(per));
}

@Injectable()
export class RolePermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    // 获取请求所需权限
    const permission = getPermission(this.reflector, context);
    const roles = getRoles(this.reflector, context);
    const guardPermission = setGuardPermission(roles, permission);
    if (!guardPermission.length) return true;
    // 获取用户权限
    const req: { user: Record<string, string> } = context
      .switchToHttp()
      .getRequest();
    const userId = req.user.id;
    const userData: UserDto | null =
      await this.userService.findUserById(userId);

    const userPemissions = userData?.roles.reduce<CreatePermissionDto[]>(
      (acc, cur: Role) => [...acc, ...cur.permission],
      [],
    );

    // 检查权限
    if (!userPemissions || !checkPermission(guardPermission, userPemissions)) {
      throw new UnauthorizedException('无权限');
    }
    return true;
  }
}
