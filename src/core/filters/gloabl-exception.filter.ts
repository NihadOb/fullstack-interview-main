import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import ErrorResponseDto from '../dtos/error-response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let message = '';
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const response = exception.getResponse();
      if (response) {
        if (typeof response === 'string') {
          message = response;
        } else if (typeof response === 'object') {
          const responseMessages = response['message'];
          if (responseMessages) {
            if (Array.isArray(responseMessages)) {
              message = responseMessages.join(', ');
            } else if (typeof responseMessages === 'string') {
              message = responseMessages;
            }
          }
        }
      }
    }

    const responseBody = new ErrorResponseDto('Internal Server Error', message);
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
