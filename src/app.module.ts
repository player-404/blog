import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ErrorFilter } from './error/error.filter';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.gurad';
import { configEnum } from './enum/config.enum';
import { GetToken } from './utils/getToken';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    LoggerModule,
    MongooseModule.forRoot(process.env[configEnum.DB_URL] as string, {
      onConnectionCreate(connect: Connection) {
        connect.on('connected', () => {
          Logger.log('数据库连接成功');
        });
      },
    }),
    UserModule,
    AuthModule,
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
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
