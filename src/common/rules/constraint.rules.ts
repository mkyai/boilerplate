import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValueAlreadyPresent', async: true })
export class IsValueAlreadyPresentConstraint
  implements ValidatorConstraintInterface
{
  async validate(value: any): Promise<boolean> {
    console.log({ value });
    return false;
  }

  defaultMessage(): string {
    return 'The value is already present in the database';
  }
}
