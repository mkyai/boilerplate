import {
  ApiController,
  ApiDelete,
  ApiGet,
  ApiPost,
  ApiPut,
  AuthUser,
} from '@micro-nest/rest';
import { Body, Query } from '@nestjs/common';
import { User } from '@prisma/client';
import { summaryData } from 'src/common/constants/app.constants';
import { SocialAuth } from 'src/common/decorators/app.decorator';
import { SocialLoginDto } from 'src/common/dto/social-login.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
const { auth: summary }: any = summaryData;
const _ = { summary };

@ApiController()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiPost({ privacy: 0, summary })
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @ApiPost({ privacy: 0, summary })
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @SocialAuth()
  @ApiPost(_)
  socialLogin(@Body() { token }: SocialLoginDto, @AuthUser() user: User) {
    return this.service.socialLogin(user);
  }

  @ApiPut({ summary })
  refresh(@Query() { token }: { token: string }) {
    return this.service.refreshToken(token);
  }

  @ApiDelete({ summary })
  logout(@AuthUser() user: User) {
    return this.service.logout(user);
  }

  @ApiGet({ summary })
  me(@AuthUser() user: User) {
    return user;
  }
}
