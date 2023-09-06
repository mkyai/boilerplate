import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsNotExist as validator } from 'src/common/validators/is-not-exists.validator';

export const DbCheck = (options?: ValidationOptions, constraints?: any[]) => {
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
