import { PrismaClient } from '@prisma/client';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getClassName } from '../helpers/app.helper';

@ValidatorConstraint({ name: 'CheckRecords', async: true })
export class CheckRecords implements ValidatorConstraintInterface {
  msg: string;
  class: string;

  constructor(private prisma: PrismaClient) {
    this.prisma = new PrismaClient({});
  }

  async validate(value: number[], args: ValidationArguments) {
    if (!value || !value.length) return true;
    this.msg = this.class = '';
    if (!value) return true;

    const repository = args.constraints
      ? args.constraints[0]
      : getClassName(args.targetName);
    this.class = repository;

    // @ts-ignore
    const records = await this.prisma[repository].findMany({
      where: { id: { in: value } },
    });

    this.msg = value
      .filter((v) => !records.map((r: any) => r.id).includes(v))
      .toString();

    return records.length === value.length;
  }

  defaultMessage() {
    return `No ${this.class} found with ids ${this.msg}`;
  }
}
