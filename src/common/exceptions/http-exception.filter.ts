import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const error = exception.getResponse() as
      | string
      | { statusCode: number; error: string; message: string | string[] };

    if (typeof error === 'string') {
      // custom error
      response.status(status).json({
        success: false,
        error,
      });
    } else {
      // basic error
      response.status(status).json({
        success: false,
        ...error,
      });
    }
  }
}
