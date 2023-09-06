import { JWT_AUTH_GUARD } from '@micro-nest/rest';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UserService } from 'src/modules/user/user.service';
import { SocialLoginDto } from '../dto/social-login.dto';
import { IsSocialTokenValid } from '../rules/is-social-token-valid.rule';

@Injectable()
export class SocialAuthGuard extends AuthGuard(JWT_AUTH_GUARD) {
  constructor(
    private readonly usersService: UserService,
    private readonly tokenValidator: IsSocialTokenValid,
  ) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: any) {
    const getUser = () => {
      return this.getUserByMail(context.args[0].body, context.args[0].headers);
    };
    user = getUser();
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  private async getUserByMail(
    body: SocialLoginDto,
    headers: Record<string, any>,
  ): Promise<User> {
    const data = await this.tokenValidator.verifyIdToken(body, headers);
    return this.usersService.findOrCreate(data, headers);
  }
}
