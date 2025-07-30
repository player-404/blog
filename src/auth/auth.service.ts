import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, passowrd: string) {
    const user = await this.userService.findOneUser(username);
    if (user && (await argon2.verify(user.password, passowrd))) {
      const payload = {
        sub: (user as { id: string }).id,
        username: user.username,
      };
      const token = await this.jwtService.signAsync(payload);
      return {
        code: HttpStatus.OK,
        message: '登录成功',
        token: token,
        user: user,
      };
    }
    throw new UnauthorizedException('用户名或密码错误');
  }
}
