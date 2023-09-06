import * as process from 'process';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
  public createJwtOptions(): JwtModuleOptions {
    return { secret: process.env.JWT_SECRET };
  }
}
