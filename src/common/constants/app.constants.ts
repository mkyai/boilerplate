import { join } from 'path';

export const increment = { increment: 1 };
export const decrement = { decrement: 1 };

export const OTP_MAIL = 'otp.mail';

export const API_KEY = 'x-api-key';

export const InvocationType = 'Event';

export const MAIL_QUEUE = 'mail';
export const FIRESTORE_QUEUE = 'firestore';
export const SEND_MAIL = 'sendMail';

export const FIRESTORE = 'firestore.config';
export const FIREBASE_SERVICE_ACCOUNT = join(
  process.cwd(),
  'serviceAccount.json',
);
export const FIRESTORE_CHANNELS = 'channels';

export enum MAIL_TYPE {
  REGISTER = 'REGISTER',
  LOGIN = 'LOGIN',
  INVITATION = 'INVITATION',
}
export enum MAIL_SUBJECT {
  REGISTER = 'Welcome',
  LOGIN = 'Login',
  VERIFY_EMAIL = 'Verify your email',
  FORGOT_PASSWORD = 'Forgot password',
  RESET_PASSWORD = 'Reset password',
}
export enum OTP_USE {
  REGISTER = 'REGISTER',
  LOGIN = 'LOGIN',
}

export const summaryData = {
  auth: {
    register: 'Create a new user',
    login: 'Login a user',
    logout: 'Logout a user',
    refresh: 'Refresh access token',
    me: 'Get current user',
    otp: 'Send OTP for registration or login',
  },

  // DYNAMIC_MODULE
};
