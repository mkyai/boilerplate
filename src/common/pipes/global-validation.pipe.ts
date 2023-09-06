import { HttpStatus, Injectable, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationException } from 'src/common/exceptions';
import { ValidationErrorInterface } from 'src/common/interfaces';

@Injectable()
export class GlobalValidationPipe {
  public static factory(): ValidationPipe {
    return new ValidationPipe({
      whitelist: true,
      transform: true,
      // forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      exceptionFactory: (_errors: ValidationError[]) => {
        const errorMessages: ValidationErrorInterface[] = [];

        function validationErrors(errors?: ValidationError[]): void {
          errors?.map((error: ValidationError) => {
            const constraints = error.constraints
              ? Object.values(error.constraints).pop()
              : undefined;
            errorMessages.push({
              field: error.property,
              message: constraints,
            });

            return validationErrors(error.children);
          });
        }

        validationErrors(_errors);
        throw new ValidationException(errorMessages);
      },
    });
  }
}
