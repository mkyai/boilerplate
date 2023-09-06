import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadType } from 'src/common/constants/auth.constants';
import { passwordRm } from 'src/common/extenders/auth.extender';
import { PrismaService } from 'src/prisma';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ identifier, type }: any) {
    if (type === JwtPayloadType.ACCESS_TOKEN)
      return <User>(
        (<unknown>(
          this.prisma
            .currentClient()
            .$extends(passwordRm)
            .user.findFirstOrThrow({
              where: { identifier },
            })
        ))
      );
    throw new BadRequestException(`Invalid access token`);
  }
}
