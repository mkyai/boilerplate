import { INestApplication } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
const { HOST_USERNAME, HOST_PASSWORD, PROJECT_NAME, NODE_ENV } =
  process.env;

export const BasicAuth = (app: INestApplication) => {
  const isProduction = NODE_ENV === 'production';
  app.use(
    ['/swagger', '/bullboard'],
    basicAuth({
      challenge: isProduction,
      realm: `${PROJECT_NAME} API [${NODE_ENV}]`,

      users: {
        [`${HOST_USERNAME}`]: `${HOST_PASSWORD}`,
      },
    }),
  );
};
