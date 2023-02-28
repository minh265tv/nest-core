import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import { LoggerService } from 'src/logger/logger.service';
import { getTimeStamp } from 'src/utils/time.util';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private message;
  constructor(
    private readonly i18n: I18nService,
    private readonly logService: LoggerService,
  ) {
    this.message = this.i18n.t('error.ERROR');
  }
  private handleResponse(
    response: Response,
    exception: HttpException | Error,
    message: string,
  ): void {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    let responseBody: any = {
      statusCode,
      message,
      error: 'INTERNAL_SERVER_ERROR',
      timestamp: getTimeStamp(),
    };

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() || {};
      responseBody = {
        statusCode: exceptionResponse['statusCode'] || statusCode,
        message: exceptionResponse['message'] || '',
        error: exceptionResponse['error'] || '',
        timestamp: getTimeStamp(),
      };
      statusCode = exception.getStatus();

      if (Array.isArray(responseBody['message'])) {
        responseBody['message'] = responseBody['message'].map((msg) =>
          this.i18n.t(msg),
        );
      }
    }

    response.status(statusCode).json(responseBody);
  }

  catch(exception: HttpException | Error, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();

    // Handling error message and logging
    this.handleMessage(exception);

    // Response to client
    this.handleResponse(response, exception, this.message);
  }

  private handleMessage(exception: HttpException | Error): void {
    let message;
    if (exception instanceof HttpException) {
      message = JSON.stringify(exception.getResponse());
    } else if (exception instanceof Error) {
      message = exception.stack.toString();
    }
    this.logService.debug(message);
  }
}
