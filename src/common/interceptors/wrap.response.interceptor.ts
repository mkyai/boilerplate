import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';
import { createSharableLink } from 'src/common/helpers/app.helper';
import { ResponseUtils, getMeta } from 'src/common/utils/response.utils';

const ResponseWrapper = (
  req: Record<string, any>,
  resp: Record<string, any>,
) => {
  const wrappers = [
    // All response wrppers here
    createSharableLink,
    // responseLangauge,
    // createUrlFromPath,
  ];
  let result = resp;
  for (const wrap of wrappers) {
    result = wrap(result, req);
  }
  return result;
};

@Injectable()
export class WrapResponseInterceptor<T> implements NestInterceptor {
  public intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const request: any = ctx.switchToHttp().getRequest<Request>();
    return next.handle().pipe(
      map((data: any) => {
        return new ResponseUtils().success(
          ResponseWrapper(request, data),
          getMeta(
            request.headers['startTime'],
            request.headers['requestId'],
            data,
          ),
        );
      }),
    );
  }
}
