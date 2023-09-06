import {
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class ThrottleGuard extends ThrottlerGuard {
  constructor(
    options: ThrottlerModuleOptions,
    storageService: ThrottlerStorage,
    reflector: Reflector,
  ) {
    super(options, storageService, reflector);
  }

  protected throwThrottlingException(context: ExecutionContext) {
    const { expiresAt }: any = Object.values(this.storageService.storage)[0];
    throw new HttpException(
      `Too Many Requests, please try again in ${Math.round(
        (expiresAt - Date.now()) / 1000,
      )} seconds`,
      429,
    );
  }
}
