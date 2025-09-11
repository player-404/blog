import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty({
    message: '角色不能为空',
  })
  @IsArray()
  roles: string[];
}
