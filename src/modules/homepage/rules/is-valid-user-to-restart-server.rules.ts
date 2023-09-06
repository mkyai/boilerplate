import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({
  name: 'IsValidParticipantUserToRestartServer',
  async: true,
})
export class IsValidParticipantUserToRestartServerRule
  implements ValidatorConstraintInterface
{
  async validate(value: string) {
    return value === process.env.SERVER_HOST_PASSWORD;
  }

  defaultMessage() {
    return `Unauthorized user`;
  }
}
