import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ErrorFilter } from './error/error.filter';
import { AuthModule } from './auth/auth.module';
import { GetToken } from './utils/getToken';
import { AuthGuard } from './auth/auth.gurad';
import { configEnum } from './enum/config.enum';
import * as dotenv from 'dotenv';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [() => dotenv.config()],
    }),
    MongooseModule.forRoot(process.env[configEnum.DB_URL] as string, {
      onConnectionCreate(connect: Connection) {
        connect.on('connected', () => {
          console.log('数据库已经连接');
        });
      },
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
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
