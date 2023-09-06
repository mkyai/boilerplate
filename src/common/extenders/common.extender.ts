import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { round } from 'lodash';
import { performance } from 'perf_hooks';
import * as util from 'util';
import {
  PaginationArgs,
  PaginationResult,
} from '../interfaces/pagination.interface';

export const exists = {
  model: {
    $allModels: {
      async exists<T>(
        this: T,
        where: Prisma.Args<T, 'findFirst'>['where'],
      ): Promise<boolean> {
        const context = Prisma.getExtensionContext(this);
        const result = await (context as any).findFirst({ where });
        return result !== null;
      },
    },
  },
};

export const pagination = {
  model: {
    $allModels: {
      async paginate<T>(
        this: T,
        args: PaginationArgs<T>,
      ): Promise<PaginationResult<T>> {
        const { page, perPage: take, ...rest } = args;
        const skip = page > 0 ? take * (page - 1) : 0;
        const orderBy = args?.orderBy || { id: 'desc' };

        const context = Prisma.getExtensionContext(this);

        const [total, records] = await Promise.all([
          await (context as any).count({ where: args.where }),
          await (context as any).findMany({
            skip,
            take,
            ...rest,
            orderBy,
          }),
        ]);
        const lastPage = Math.ceil(total / take);
        return {
          records,
          meta: {
            total,
            lastPage,
            currentPage: page,
            perPage: take,
            orderBy,
          },
        };
      },
    },
  },
};

export const save = {
  model: {
    $allModels: {
      save: {
        needs: { id: true },
        compute({ id, ...data }: any) {
          return () => {
            const context = Prisma.getExtensionContext(this);
            return (context as any).update({ where: { id }, data });
          };
        },
      },
    },
  },
};

export const queryLog = {
  query: {
    $allModels: {
      async $allOperations(obj: any) {
        const { operation, model, args, query } = obj;
        const start = performance.now();
        const result = await query(args);
        const end = performance.now();
        const time = end - start;
        Logger.log(
          `[PRISMA QUERY] ${model}.${operation} took ${round(time)}ms`,
        );
        if (['delete', 'update'].includes(operation)) {
          Logger.log(
            util.inspect(
              `[PRISMA ${operation.toUpperCase()}] : `, // TODO: add audit log
              {
                showHidden: false,
                depth: null,
                colors: true,
              },
            ),
          );
        }
        return result;
      },
    },
  },
};

export const share = (req: Request) => ({
  result: {
    $allModels: {
      shareLink: {
        needs: { id: true },
        compute(obj: Record<string, any>) {
          return undefined;
          //@ts-ignore
          // if (!req.contentSharable || obj.identifier) return undefined;
          // const match = req.url.match(/\/api\/v1\/([^/]+)\//);
          // return getSharableLink(
          //   obj.id,
          //   match ? match[1] : 'default',
          //   <string>req.headers['x-tenant-id'],
          // );
        },
      },
    },
  },
});

export const createEvent = (emitter: EventEmitter2) => ({
  query: {
    $allModels: {
      async $allOperations({ args, query, model, operation }: any) {
        const result = await query(args);
        emitter.emit(`${model}.${operation}d`.toLowerCase(), { args, result });
        return result;
      },
    },
  },
});
