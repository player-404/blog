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
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
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
  // cookie
  app.use(cookieParser());
  // 注册全局logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  //app.select(AppModule): 这指定了 NestJS 的根模块 (AppModule) 作为 class-validator 要使用的容器。app.select(AppModule) 用于获取特定模块的容器。
  //{ fallbackOnErrors: true }: 这个选项非常重要。当 NestJS 的容器无法解析某个类（例如 class-validator 内部自己的某些类）时，会回退到 class-validator 自己的默认容器去解析，而不是直接抛出错误
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // 注册全局pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // 传递的属性在dto中不存在时将会被过滤
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
    app.enableCors({
      credentials: true,
      origin: 'http://localhost:5173',
    });
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
