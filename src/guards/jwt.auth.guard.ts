import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('jwt auth guard', isPublic);
    if (isPublic) return true; // isPublic 为true代表公共接口，不进行token验证
    return super.canActivate(context);
  }
  handleRequest(err: any, user: any): any {
    if (err || !user) {
      throw new UnauthorizedException('身份验证失败'); // 自定义错误消息
    }
    return user;
  }
}
