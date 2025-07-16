import { IsNotEmpty, MinLength } from 'class-validator';
import { Match } from 'src/decorator/match.decorator';

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
}

export interface IUser {
  username?: string;
  password?: string;
  _confirmPassword?: string;
}
