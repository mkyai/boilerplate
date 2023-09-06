export class SocialUserDto {
  name!: string;

  email!: string;

  constructor(email: string, firstName?: string, lastName?: string) {
    this.name = `${firstName} ${lastName}`.trim() ?? '';
    this.email = email;
  }
}
