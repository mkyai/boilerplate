import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

import { hashSync } from 'bcryptjs';
import { Unique } from 'src/common/decorators/rules/unique.rule';

export class RegisterDto {
  @IsString()
  name: string = 'username';

  @IsString()
  @IsEmail()
  @Unique({}, ['user'])
  email: string = 'user123@gmail.com';

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
  })
  @Transform(({ value }) => (value ? hashSync(value) : value))
  password: string = 'User@123#';
}
