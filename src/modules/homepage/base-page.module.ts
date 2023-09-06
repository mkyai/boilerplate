import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { BasePageController } from './base-page.controller';
import { BasePageService } from './base-page.service';
import { ApiHealthIndicator } from './checkers/api.health';
import { RedisHealthIndicator } from './checkers/redis.health';

@Module({
  imports: [TerminusModule],
  controllers: [BasePageController],
  providers: [RedisHealthIndicator, ApiHealthIndicator, BasePageService],
})
export class BasePageModule {}
