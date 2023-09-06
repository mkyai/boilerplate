// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-google-oauth20';

// import { GOOGLE_AUTH_GUARD } from '@constants/shared.constants';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, GOOGLE_AUTH_GUARD) {
//     constructor(private readonly configService: ConfigService) {
//         super({
//             clientID: configService.get('GOOGLE_CLIENT_ID'),

//             clientSecret: configService.get('GOOGLE_SECRET'),

//             callbackURL: `${process.env.HOST_URL}/api/v1/auth/redirect`,

//             scope: ['email', 'profile'],
//         });
//     }

//     async validate(
//         accessToken: string,
//         refreshToken: string,
//         { _json: { email, name, picture } }: any,
//         done: VerifyCallback,
//     ): Promise<any> {
//         done(null, {
//             email,
//             name,
//             picture,
//         });
//     }
// }
