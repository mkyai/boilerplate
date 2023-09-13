import { JWT_AUTH_GUARD } from '@micro-nest/rest';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaClient, User } from '@prisma/client';
import { SocialLoginDto } from '../dto/social-login.dto';
import { IsSocialTokenValid } from '../rules/is-social-token-valid.rule';

@Injectable()
export class SocialAuthGuard extends AuthGuard(JWT_AUTH_GUARD) {
  constructor(
    private prisma: PrismaClient,
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
    const data: any = await this.tokenValidator.verifyIdToken(body, headers);
    let user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      user = await this.prisma.user.create({ data });
    }
    return user;
  }
}
