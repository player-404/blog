import { Module } from '@nestjs/common';
import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import { configEnum } from '../../enum/config.enum';
import { createLogger } from './createlogger';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logOn = configService.get<string>(configEnum.LOG_ON);
        return {
          transports: [
            new winston.transports.Console({
              level: 'info',
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                utilities.format.nestLike('logger'),
              ),
            }),
            ...(logOn
              ? [
                  createLogger('application', 'info'),
                  createLogger('application', 'error'),
                ]
              : []),
          ],
        };
      },
    }),
  ],
})
export class LoggerModule {}
