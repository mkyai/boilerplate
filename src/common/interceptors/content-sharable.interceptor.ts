import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ContentSharable implements NestInterceptor {
  public intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const request: any = ctx.switchToHttp().getRequest<Request>();
    request.contentSharable = true;
    return next.handle();
  }
}
