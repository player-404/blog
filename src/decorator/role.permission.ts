import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { action, PERMISSION_KEY } from '@/enum/permission.enum';
//
const accumulateMetadata = (key: string, permission: string) => {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const reflector = new Reflector();
    if (descriptor && descriptor.value) {
      const existingPermissions: [] =
        reflector.get(key, descriptor.value) || [];
      const newPermission = [...existingPermissions, permission];
      SetMetadata(key, newPermission)(target, propertyKey, descriptor);
    }
  };
};

export const update = () => SetMetadata(PERMISSION_KEY, action.UPDATE);

export const deletes = () => SetMetadata(PERMISSION_KEY, action.DELETE);

export const create = () => SetMetadata(PERMISSION_KEY, action.CREATE);

export const read = () => SetMetadata(PERMISSION_KEY, action.READ);
