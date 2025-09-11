import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { CheckDefaultRole } from '@/decorator/default-role-check';

export class CreateRoleDto {
  @IsNotEmpty({
    message: '角色名称不能为空',
  })
  name: string;
  @IsArray()
  @IsOptional()
  permission: string[];
  @IsNotEmpty({ message: '角色描述不能为空' })
  description: string;
  @CheckDefaultRole()
  isDefault: boolean;
}
