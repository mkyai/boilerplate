import { PrismaClient } from '@prisma/client';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { getClassName } from '../helpers/app.helper';

@ValidatorConstraint({ name: 'IsNotExist', async: true })
export class IsNotExist implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaClient) {
    this.prisma = new PrismaClient({});
  }

  async validate(value: string, args: ValidationArguments) {
    if (!value) return true;

    const repository = args.constraints
      ? args.constraints[0]
      : getClassName(args.targetName);
    const key =
      args.constraints && args.constraints[1]
        ? args.constraints[1]
        : args.property;

    // @ts-ignore
    const record = await this.prisma[repository].findFirst({
      where: { [key]: key === 'id' ? +value : value },
    });
    return !!record;
  }

  defaultMessage(args: ValidationArguments) {
    const repository = args.constraints
      ? args.constraints[0]
      : getClassName(args.targetName);
    return `${repository} with ${args.property} '${args.value}' does not exists`;
  }
}
