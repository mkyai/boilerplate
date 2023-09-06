import { OAuth2Client } from 'google-auth-library';

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common/services/logger.service';
import { SocialLoginDto } from '../dto/social-login.dto';
import { SocialUserDto } from '../dto/social-user.dto';
const { SOCIAL_LOGIN_KEY } = process.env;

@Injectable()
export class IsSocialTokenValid {
  async verifyIdToken(
    { token }: SocialLoginDto,
    headers: Record<string, any>,
  ): Promise<SocialUserDto> {
    return this.googleLogin(`${SOCIAL_LOGIN_KEY}`, token);
  }

  async googleLogin(audience: string, idToken: string) {
    const client = new OAuth2Client(audience);
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new BadRequestException();
      }
      this.validateCredentials(payload.email, !!payload.email_verified);
      return new SocialUserDto(
        payload.email,
        payload.given_name,
        payload.family_name,
      );
    } catch (error) {
      Logger.warn(`Verify Id token API failed. Error : ${error}`);
      throw new BadRequestException(`Invalid social token`);
    }
  }

  private validateCredentials(email: string, verified: boolean): void {
    if (!verified) {
      Logger.warn(
        `Can not valid social login for email ${email} due to email is not verified.`,
      );
      throw new UnauthorizedException(`Email not verified for social login`);
    }
  }
}
