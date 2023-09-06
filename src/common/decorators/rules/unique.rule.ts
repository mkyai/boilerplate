import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsExist as validator } from 'src/common/validators/is-exists.validator';

export const Unique = (options?: ValidationOptions, constraints?: any) => {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'Unique',
      target: object.constructor,
      propertyName,
      options,
      validator,
      constraints,
    });
  };
};
