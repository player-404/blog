import { IsArray, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Match } from 'src/decorator/match.decorator';
import { PartialType } from '@nestjs/mapped-types';

export class UserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;
  @MinLength(6, {
    message: '密码不能少于6位',
  })
  password: string;
  @Match('password')
  confirmPassword: string;
  @IsArray()
  @IsOptional()
  roles: any[];
}

export interface IUser {
  username?: string;
  password?: string;
  confirmPassword?: string;
  _confirmPassword?: string;
  roles?: any[];
}

export class updateUserDto extends PartialType(UserDto) {}
