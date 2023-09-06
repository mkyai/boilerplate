import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { isEmpty } from 'lodash';
import { getRequestId } from '../helpers/app.helper';
import { filterKeys } from '../utils/response.utils';

@Injectable()
class LogsMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    const startTime = String(Date.now());
    const requestId = `${getRequestId()}`;

    request.headers['startTime'] = startTime;
    request.headers['requestId'] = requestId;

    const { headers, method, originalUrl } = request;
    let httpLoggerMessage = `[${request.ip || headers['x-forwarded-for']}] [${
      headers['x-platform'] || 'x-platform'
    }] [${headers['user-agent']}] [${requestId}] ${method} ${originalUrl} `;

    if (!isEmpty(request.body)) {
      const requestBody = JSON.stringify(filterKeys(request.body));
      if (requestBody) {
        httpLoggerMessage = `${httpLoggerMessage}  ${requestBody}`;
      }
    }

    this.logger.log(httpLoggerMessage);
    next();
  }
}

export default LogsMiddleware;
