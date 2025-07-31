import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
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
