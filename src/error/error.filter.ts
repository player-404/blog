import {
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Catch,
  HttpStatus,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

// 处理全局的错误
@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error(exception.message, exception.stack);
    // mongoose错误
    if (exception.name === 'MongooseError') {
      if ((exception as { cause: { code: number } }).cause.code === 11000) {
        response.status(HttpStatus.CONFLICT).json({
          code: HttpStatus.CONFLICT,
          message: exception.message,
        });
      }
    }
    // // HttpException错误
    // if (exception.name === 'HttpException') {
    //   response.status(exception.getStatus()).json({
    //     code: exception.getStatus(),
    //     message: exception.getResponse(),
    //   });
    // }
    console.log('错误', exception);
    const errResponse = exception.getResponse();
    response.status(exception.getStatus()).json({
      code: exception.getStatus(),
      ...(errResponse as Record<string, any>),
    });
  }
}
