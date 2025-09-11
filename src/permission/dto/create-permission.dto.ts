import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty({
    message: '权限名称不能为空',
  })
  name: string;
  @IsNotEmpty({ message: '权限描述不能为空' })
  description: string;
  @IsNotEmpty({
    message: '权限不能为空',
  })
  @IsOptional()
  action: string;
}
