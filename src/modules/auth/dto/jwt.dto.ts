import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class JwtDto {
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  readonly token: string;
}
