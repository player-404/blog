import { TimestampOptions } from './../node_modules/logform/index.d';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import * as winston from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import 'winston-daily-rotate-file';
async function bootstrap() {
  // 创建winston实例
  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike(),
        ),
      }),
      // 记录日志到文件
      new winston.transports.DailyRotateFile({
        level: 'info',
        // 保存日志文件的目录
        dirname: 'logs',
        filename: 'logs/application-info-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m', // 文件最大20M
        maxFiles: '14d', // 最多保存14天
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple(),
        ),
      }),
      new winston.transports.DailyRotateFile({
        level: 'error',
        // 保存日志文件的目录
        dirname: 'logs',
        filename: 'logs/application-error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m', // 文件最大20M
        maxFiles: '14d', // 最多保存14天
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple(),
        ),
      }),
    ],
  });
  const app = await NestFactory.create(AppModule, {
    // 替换默认logger为winston
    logger: WinstonModule.createLogger({
      instance: logger,
    }),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
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
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
