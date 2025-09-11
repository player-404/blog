import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { action, PERMISSION_KEY, ROLES_KEY } from '@/enum/permission.enum';

// 获取多个权限
const setRoles =
  (key: string, roleName: string) =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let newRoles;
    const reflector = new Reflector();
    if (descriptor && descriptor.value) {
      const exitRoles: string[] =
        reflector.get(PERMISSION_KEY, descriptor.value) || [];
      newRoles = [...new Set([...exitRoles, roleName])];
    }

    SetMetadata(key, newRoles)(target, propertyKey, descriptor); // setmetadata底层实现的逻辑中需要target等参数
  };

export const permission = (permission: string) =>
  SetMetadata(ROLES_KEY, permission);
export const update = () => setRoles(PERMISSION_KEY, action.UPDATE);

export const deletes = () => setRoles(PERMISSION_KEY, action.DELETE);

export const create = () => setRoles(PERMISSION_KEY, action.CREATE);

export const read = () => setRoles(PERMISSION_KEY, action.READ);
