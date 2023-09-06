import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { SERVER_STATUS } from 'src/modules/homepage/constants/base-page.constants';

@Injectable()
export class ApiHealthIndicator extends HealthIndicator {
  async unitTest(key: string): Promise<HealthIndicatorResult> {
    const [status, isWorking] = await this.testAPI();
    const result = this.getStatus(key, isWorking, { status });
    if (isWorking) {
      return result;
    }

    throw new HealthCheckError('Api check failed', result);
  }

  private async testAPI(): Promise<[SERVER_STATUS, boolean]> {
    // TODO: Unit test API
    return [SERVER_STATUS.UP, true];
  }
}
