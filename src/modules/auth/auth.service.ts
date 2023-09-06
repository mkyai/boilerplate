import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, User } from '@prisma/client';
import { compareSync } from 'bcryptjs';
import { isJWT } from 'class-validator';
import { JwtPayloadType } from 'src/common/constants/auth.constants';
import { JwtPayload } from 'src/common/interfaces';
import { PrismaService } from 'src/prisma';
import { v4 } from 'uuid';
import { JwtTokensDto } from './dto/jwt-tokens.dto';
import { LoginPayload } from './dto/login-payload.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import UserDto from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.prismaService
      .currentClient()
      .user.findFirstOrThrow({ where: { email } });
    if (!compareSync(password, `${user.password}`))
      throw new BadRequestException(`Invalid password`);
    //@ts-ignore
    user.password = undefined;

    return new UserDto(user, this.getLoginTokens(new LoginPayload(user)));
  }

  async socialLogin(user: User): Promise<UserDto> {
    const accessToken = this.getLoginTokens(new LoginPayload(user));
    return new UserDto(user, accessToken);
  }

  async logout({ email, identifier }: User) {
    await this.prisma.user.update({
      where: { email: `${email}`, identifier },
      data: { identifier: v4() },
    });
  }

  async register(data: RegisterDto) {
    const user = await this.prisma.user.create({ data });
    return new UserDto(user, this.getLoginTokens(new LoginPayload(user)));
  }

  async refreshToken(token: string) {
    const { identifier } = this.verifyToken(
      token,
      JwtPayloadType.REFRESH_TOKEN,
    );
    const user = await this.prisma.user.findFirstOrThrow({
      where: { identifier },
    });
    return new UserDto(user, this.getLoginTokens(new LoginPayload(user)));
  }

  verifyToken(token: string, type: JwtPayloadType): JwtPayload {
    if (!isJWT(token)) {
      throw new BadRequestException(`Please provide a valid JWT`);
    }
    let decodedUser;
    try {
      decodedUser = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      }) as JwtPayload;
    } catch (error) {
      if (type === JwtPayloadType.FORGOT_PASSWORD) error = 'Link expired';
      throw new BadRequestException(this, error);
    }
    if (!decodedUser || decodedUser.type !== type) {
      throw new BadRequestException(this, `Invalid token`);
    }
    return decodedUser;
  }

  getLoginTokens(payload: LoginPayload): JwtTokensDto {
    const accessToken = this.signJwtToken(
      { type: JwtPayloadType.ACCESS_TOKEN, ...payload },
      this.configService.get('JWT_ACCESS_DURATION'),
    );
    const refreshToken = this.signJwtToken(
      { type: JwtPayloadType.REFRESH_TOKEN, ...payload },
      this.configService.get('JWT_REFRESH_DURATION'),
    );
    return new JwtTokensDto({ accessToken, refreshToken });
  }

  signJwtToken(
    payload: JwtPayload,
    expiresIn: string | number | undefined,
  ): string {
    return this.jwtService.sign(
      { ...payload },
      {
        expiresIn,
        secret: this.configService.get('JWT_SECRET'),
      },
    );
  }
}
