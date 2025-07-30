import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { GetToken } from '../utils/getToken';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('getToken') private readonly getToken: GetToken,
    private readonly JwtService: JwtService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token = this.getToken.extractTokenFromHeader(req);
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    if (!token) {
      throw new UnauthorizedException('身份验证失败！');
    }
    try {
      const payload = await this.JwtService.verifyAsync<Record<string, any>>(
        token,
        {
          secret: process.env.JWT_SECRET,
        },
      );
      const user = await this.userService.findUserById(payload.sub);
      if (!user) throw new UnauthorizedException('用户不存在,请重新登录');
      req['user'] = user;
    } catch (error) {
      console.log('token 验证出错', error);
      throw new UnauthorizedException('身份验证失败！');
    }

    return true;
  }
}
