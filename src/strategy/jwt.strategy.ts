import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configEnum } from '../enum/config.enum';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 提取 JWT 的方法
      ignoreExpiration: false, // 设置将确保 JWT 未过期的责任委托给 Passport 模块。这意味着如果路由收到过期的 JWT，请求将被拒绝并返回 401 Unauthorized 响应。Passport 会自动为我们便捷地处理这一过程
      secretOrKey: configService.get<string>(configEnum.JWT_SECRET) as string, //密钥
    });
  }

  // token验证成功会将解析的payload作为参数传入
  validate(payload: { sub: string; username: string }) {
    return {
      username: payload.username,
      id: payload.sub,
    };
  }
}
