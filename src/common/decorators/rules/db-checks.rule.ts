import { ValidationOptions, registerDecorator } from 'class-validator';
import { CheckRecords as validator } from 'src/common/validators/check-records.validator';

export const DbChecks = (options?: ValidationOptions, constraints?: any[]) => {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'DbCheck',
      target: object.constructor,
      propertyName,
      options,
      validator,
      constraints,
    });
  };
};
