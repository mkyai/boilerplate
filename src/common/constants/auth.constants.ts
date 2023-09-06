export enum JwtPayloadType {
  ACCESS_TOKEN = 'access-token',
  REFRESH_TOKEN = 'refresh-token',
  VERIFICATION_TOKEN = 'verification-token',
  FORGOT_PASSWORD = 'forgot-password',
}

export const LOCAL_AUTH_GUARD = 'local';
