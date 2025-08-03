import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`], // 根据环境读取相应的配置，这里可以直接读取 process.env
    }),
  ],
})
export class ConfigModules {}
