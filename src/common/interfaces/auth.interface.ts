import { JwtPayloadType } from '../constants/auth.constants';

export interface JwtPayload {
  readonly email: string;
  readonly identifier: string;
  readonly type: JwtPayloadType;
}
