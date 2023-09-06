import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsEmail()
  email: string = 'user@gmail.com';

  @IsString()
  @IsNotEmpty()
  password: string = 'User123#';
}
