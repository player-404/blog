import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configEnum } from './enum/config.enum';
import { ConfigService } from '@nestjs/config';
import {
  ValidationPipe,
  HttpException,
  HttpStatus,
  VersioningType,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 获取configservice
  const configService = app.get(ConfigService);
  // 获取前缀
  const prefix: string = configService.get<string>(configEnum.PREFLIX, ''); // 前缀
  // 是否开启跨域
  const cors: boolean = configService.get<boolean>(configEnum.CORS, false);
  // 获取版本号
  const version: string = configService.get<string>(configEnum.VERSION, '');
  // 注册全局logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // 注册全局pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // 格式化class-validator错误
      exceptionFactory(error) {
        console.log('validate error', error);
        const result = error.map((err) => {
          return {
            [err.property]: Object.values((err as any).constraints)[0],
          };
        });
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      },
    }),
  );
  // 设置前缀
  app.setGlobalPrefix(prefix);
  // 设置版本号
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: [version],
  });
  // 开启跨域
  if (cors) {
    app.enableCors();
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
