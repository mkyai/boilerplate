import { User } from '@prisma/client';
import { Expose } from 'class-transformer';
import { JwtTokensDto } from './jwt-tokens.dto';

export default class UserDto {
  constructor(user: User, tokens?: JwtTokensDto) {
    this.user = user;
    this.tokens = tokens;
  }

  @Expose()
  user: User;

  @Expose()
  tokens: JwtTokensDto | undefined;
}
