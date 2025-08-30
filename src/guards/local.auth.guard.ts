import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest(err: any, user: any): any {
    if (err || !user) {
      console.log('local auth guard');
      throw new UnauthorizedException('身份验证失败'); // 自定义错误消息
    }
    return user;
  }
}
