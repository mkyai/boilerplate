// import { LambdaClient } from '@aws-sdk/client-lambda';
// import { FactoryProvider } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

// export const LambdaProvider: FactoryProvider<LambdaClient> = {
//   provide: LambdaClient,
//   inject: [ConfigService],
//   useFactory: (config: ConfigService) =>
//     new LambdaClient({
//       region: config.get('AWS_REGION'),
//       credentials: {
//         accessKeyId: <string>config.get('AWS_ACCESS_KEY_ID'),
//         secretAccessKey: <string>config.get('AWS_SECRET_ACCESS_KEY'),
//       },
//     }),
// };
