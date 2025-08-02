import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { configEnum } from '@/enum/config.enum';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'single',
          url: config.get<string>(configEnum.REDIS_HOST),
          options: {
            password: config.get<string>(configEnum.REDIS_PASSWORD),
          },
        };
      },
    }),
  ],
})
export class RedisModules {}
