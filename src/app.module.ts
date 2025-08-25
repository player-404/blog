import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ErrorFilter } from './error/error.filter';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { configEnum } from './enum/config.enum';
import { GetToken } from './utils/getToken';
import { LoggerModule } from './common/logger/logger.module';
import { RedisModules } from './common/reids/redis.module';
import { ConfigModules } from '@/common/config/config.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    ConfigModules,
    LoggerModule, // 初始化 winston 配置
    RedisModules, // redis
    MongooseModule.forRoot(process.env[configEnum.DB_URL] as string, {
      onConnectionCreate(connect: Connection) {
        connect.on('connected', () => {
          Logger.log('数据库连接成功');
        });
      },
    }),
    UserModule,
    AuthModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [
    Logger,
    AppService,
    {
      provide: 'getToken',
      useClass: GetToken,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
