import { Prisma } from '@prisma/client';

export type PaginationArgs<T> = {
  page?: number;
  perPage?: number;
} & Prisma.Args<T, 'findMany'> &
  Prisma.Args<T, 'findMany'>['orderBy'];

export enum OrderBy {
  ASC = 'asc',
  DESC = 'desc',
}

export type PaginationResult<T> = {
  records: T[];
  meta: PaginationMeta;
};

export interface PaginationMeta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  orderBy: order;
}

export type order = {
  [key: string]: OrderBy;
};
