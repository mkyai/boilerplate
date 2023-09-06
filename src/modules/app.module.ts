import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppConfigModule } from 'src/common/config/app-config.module';
import { ThrottleConfig } from 'src/common/config/throttle.config';
import { HttpExceptionsFilter } from 'src/common/filters/http-exception.filter';
import { ThrottleGuard } from 'src/common/guards/throttle.guard';
import { WrapResponseInterceptor } from 'src/common/interceptors/wrap.response.interceptor';
import ApiKeyMiddleware from 'src/common/middleware/api-key.middleware';
import HttpResponseMiddleware from 'src/common/middleware/http-response.middleware';
import LogsMiddleware from 'src/common/middleware/logs.middleware';
import { GlobalValidationPipe } from 'src/common/pipes/global-validation.pipe';
import { TrimPipe } from 'src/common/pipes/input-trim.pipe';
import { BasePageModule } from './homepage/base-page.module';
import ServicesModule from './services.module';

@Module({
  imports: [
    AppConfigModule,
    BasePageModule,
    ThrottlerModule.forRoot(ThrottleConfig),
    ServicesModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: GlobalValidationPipe.factory(),
    },

    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottleGuard,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: WrapResponseInterceptor,
    },

    {
      provide: APP_PIPE,
      useClass: TrimPipe,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(ApiKeyMiddleware, LogsMiddleware, HttpResponseMiddleware)
      .forRoutes({ method: RequestMethod.ALL, path: '*' });
  }
}
