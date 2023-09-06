import { MicroLogger } from '@micro-nest/rest';
import { Logger, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';
import { BasicAuth } from './common/config/basic.auth';
import { BullBoardSetup } from './common/config/bull-board.config';
import { SwaggerSetup } from './common/config/swagger.config';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: MicroLogger(),
  });

  app.useStaticAssets(join(process.cwd(), 'src/modules/homepage/static'));
  app.setBaseViewsDir(join(process.cwd(), 'src/modules/homepage/static'));
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  app.setViewEngine('hbs');
  app.set('trust proxy', 1);
  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: '/changelogs', method: RequestMethod.GET },
      { path: '/erd', method: RequestMethod.GET },
    ],
  });
  BasicAuth(app);
  await SwaggerSetup(app);
  BullBoardSetup(app);

  const PORT = app.get(ConfigService).get<number>('SERVER_PORT', 3000);
  await app.listen(PORT, () =>
    Logger.log(`API Gateway is listening on port ${PORT}`),
  );
}

void bootstrap();
