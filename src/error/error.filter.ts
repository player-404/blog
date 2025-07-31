import {
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Catch,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

// 处理全局的错误
@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
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
    console.log('其他错误', exception);
    const errResponse = exception.getResponse();
    response.status(exception.getStatus()).json({
      code: exception.getStatus(),
      ...(errResponse as Record<string, any>),
    });
  }
}
