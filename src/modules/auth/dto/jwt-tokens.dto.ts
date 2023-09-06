import { Expose } from 'class-transformer';

export class JwtTokensDto {
  @Expose()
  public accessToken: string;

  @Expose()
  public refreshToken: string;

  constructor(props: any) {
    Object.assign(this, props);
  }
}
