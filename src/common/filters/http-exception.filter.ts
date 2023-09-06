import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger('HTTP-ERROR');

  public catch(exception: any, host: ArgumentsHost): void {
    const status = this.getHttpStatus(exception);
    const req: any = host.switchToHttp().getRequest();
    this.render(exception, status, req.headers['requestId']);

    host
      .switchToHttp()
      .getResponse<Response>()
      .status(status)
      .json({
        data: {
          message: exception.message,
          error:
            exception?.errors ||
            exception?.response?.errors ||
            exception?.response?.error,
        },
        meta: {
          requestId: req.headers['requestId'],
          success: false,
          duration: Date.now() - req.headers['startTime'],
          size: '131 bytes',
          timestamp: new Date(),
        },
      });
  }

  private getHttpStatus(exception: any): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private render(exception: any, status: any, requestId: any) {
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      exception instanceof Error
        ? this.logger.error(
            `[${requestId}] ${exception.message}`,
            exception.stack,
          )
        : this.logger.error(
            `[${requestId}] : UnhandledException =>${
              JSON.stringify(exception) || exception
            }`,
            exception.stack,
          );
    } else {
      this.logger.warn(`[${requestId}] ${exception.message}`);
    }
  }
}
