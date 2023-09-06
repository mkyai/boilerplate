import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ReasonPhrases } from 'http-status-codes';
import { ResponseUtils } from 'src/common/utils/response.utils';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(httpGeneralException: any, host: ArgumentsHost): void {
    const httpContext = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;

    const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const httpResponse = new ResponseUtils().error(
      httpStatus,
      ReasonPhrases.INTERNAL_SERVER_ERROR,
      'Server internal error occurred, please try later',
      httpGeneralException?.error_code,
    );

    this.logger.error(
      httpGeneralException.message,
      httpGeneralException?.stack,
    );
    httpAdapter.reply(httpContext.getResponse(), httpResponse, httpStatus);
  }
}
