import { RoleService } from '@/role/role.service';
import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class checkDefault implements ValidatorConstraintInterface {
  constructor(private readonly roleService: RoleService) {}
  async validate(value: any, args: ValidationArguments) {
    const isDefault = args.object['isDefault'] as boolean;
    if (!isDefault) return true;
    const haveDefaultRole = await this.roleService.findDefaultRole();
    console.log('haveDefaultRole', haveDefaultRole);
    if (haveDefaultRole.data) return false;
    return true;
  }
  defaultMessage(): string {
    return '已经设置默认角色';
  }
}
