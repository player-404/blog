import { IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty({
    message: '权限名称不能为空',
  })
  name: string;
  description: string;
  @IsNotEmpty({
    message: '权限不能为空',
  })
  action: string[];
}
