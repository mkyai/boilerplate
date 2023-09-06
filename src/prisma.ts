import {
  FactoryProvider,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { passwordRm } from './common/extenders/auth.extender';
import { queryLog } from './common/extenders/common.extender';
import { isLogin } from './common/helpers/app.helper';

@Injectable()
export class PrismaService implements OnModuleInit {
  private client: PrismaClient;

  async onModuleInit() {
    this.setClient();
  }

  getClient(req: Request): PrismaClient {
    const wrappers = [];
    let client = this.client;
    if (!client) {
      Logger.log('Prisma client not found, creating new instance');
      this.setClient();
    }
    wrappers.push(
      // PUSH YOUR WRAPPERS HERE (guide : prisma extensions[https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions]),
      queryLog,
    );
    if (isLogin(req)) wrappers.push(passwordRm);

    return this.wrapClient(client, wrappers);
  }

  wrapClient(
    client: PrismaClient,
    wrappers: Record<string, any>[],
  ): PrismaClient {
    let wrappedClient = client;

    for (const wrapper of wrappers) {
      wrappedClient = <PrismaClient>(<unknown>wrappedClient.$extends(wrapper));
    }

    return wrappedClient;
  }

  currentClient() {
    return this.client;
  }

  setClient(): void {
    this.client = new PrismaClient();
  }
}

export const PrismaManager: FactoryProvider<PrismaClient> = {
  provide: PrismaClient,
  inject: [REQUEST, PrismaService],
  useFactory: (req: Request, manager: PrismaService) => manager.getClient(req),
};
