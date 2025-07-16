import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signIn(username: string, passowrd: string) {
    const user = await this.userService.findOneUser(username);
    if (user && (await argon2.verify(user.password, passowrd)))
      return {
        code: HttpStatus.OK,
        message: '登录成功',
        user,
      };
    throw new UnauthorizedException('用户名或密码错误');
  }
}
