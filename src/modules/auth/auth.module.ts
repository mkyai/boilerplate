import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtConfig } from 'src/common/config/jwt.config';
import { IsSocialTokenValid } from 'src/common/rules/is-social-token-valid.rule';
import { PrismaManager, PrismaService } from 'src/prisma';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    IsSocialTokenValid,

    PrismaService,
    PrismaManager,
    JwtStrategy,
  ],
})
export class AuthModule {}
