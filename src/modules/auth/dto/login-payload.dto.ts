import { User } from '@prisma/client';

export class LoginPayload {
  public identifier: string;
  public email: string;

  constructor({ email, identifier }: User) {
    this.email = email || '';
    this.identifier = identifier;
  }
}
