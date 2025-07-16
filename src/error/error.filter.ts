import {
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Catch,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // mongoose错误
    if (exception.name === 'MongooseError') {
      if ((exception as { cause: { code: number } }).cause.code === 11000) {
        response.status(HttpStatus.CONFLICT).json({
          code: HttpStatus.CONFLICT,
          message: exception.message,
        });
      }
    }
    // HttpException错误
    if (exception.name === 'HttpException') {
      response.status(exception.getStatus()).json({
        code: exception.getStatus(),
        message: exception.getResponse(),
      });
    }
  }
}
