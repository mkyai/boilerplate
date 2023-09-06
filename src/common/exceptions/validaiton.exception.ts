import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { round } from 'lodash';

export class ValidationException extends UnprocessableEntityException {
  constructor(
    errors: any,
    message: string = 'Please corrected the following error message.',
  ) {
    super({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      name: 'Unprocessable Entity',
      message,
      errors,
      meta: {
        success: false,
        duration: round(Math.random() * 10, 2),
        size: '131 bytes',
        timestamp: new Date(),
      },
    });
  }
}
