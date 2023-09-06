import {
  HOME_PAGE_URL,
  SERVER_STATUS,
} from 'src/modules/homepage/constants/base-page.constants';
import { HealthCheckResult, HealthIndicatorStatus } from '@nestjs/terminus';

const getErrors = (obj: any, val: string) => {
  return obj[val].error ? `${val.toUpperCase()} ${obj[val].error}\n` : [];
};

export class HealthCheckResponseDto {
  readonly host!: string;

  readonly api!: HealthIndicatorStatus;

  readonly postgres!: HealthIndicatorStatus;

  readonly redis!: HealthIndicatorStatus;

  readonly server!: CheckResult;

  constructor({ details }: HealthCheckResult) {
    this.host = process.env.HOST_URL ?? HOME_PAGE_URL;
    this.api = details.api.status;
    this.postgres = details.postgres.status;
    this.redis = details.redis.status;
    this.server = <CheckResult>{
      // eslint-disable-next-line no-constant-condition
      status: 'ok' ? SERVER_STATUS.UP : SERVER_STATUS.DOWN,
      errors: Object.keys(details)
        .map((service: string) => getErrors(details, service))
        .flat(),
    };
    this.server.isError = !!this.server.errors;
  }
}

interface CheckResult {
  status: SERVER_STATUS;
  isError: boolean;
  errors?: string[];
}
