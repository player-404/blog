import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { configEnum } from '../enum/config.enum';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@/strategy/local.strategy';
import { JwtStrategy } from '@/strategy/jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule), // 延迟加载模块， 解决模块循环引用问题
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env[configEnum.JWT_SECRET],
        signOptions: { expiresIn: process.env[configEnum.JWT_EXPIRES_IN] },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
