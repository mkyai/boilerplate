import { SERVER_STATUS } from 'src/modules/homepage/constants/base-page.constants';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { Injectable, Logger } from '@nestjs/common';

// import { AuthEntity } from '@modules/auth/entities/auth.entity'; // TODO: Redis-ms ping

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  private readonly logger: Logger = new Logger(RedisHealthIndicator.name);

  constructor() {
    // private redisClient: AuthEntity
    super();
  }

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    try {
      const [status, isWorking, error] = await this.checkRedis();

      return this.getStatus(key, isWorking, { status, error });
    } catch (error) {
      throw new HealthCheckError('Redis check failed internally', error);
    }
  }

  private async checkRedis(): Promise<[SERVER_STATUS, boolean, string?]> {
    try {
      // const result = await this.redisClient.testConnection();
      const result = 'PONG';
      if (result && result === 'PONG') return [SERVER_STATUS.UP, true];
      this.logger.warn(`Some error in redis : ${result}`);

      return [SERVER_STATUS.DOWN, false, result];
    } catch (error) {
      this.logger.error(`Error in redis connection : ${error}`);

      return [SERVER_STATUS.DOWN, false, `${error}`];
    }
  }
}
