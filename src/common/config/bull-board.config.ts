import { INestApplication } from '@nestjs/common';

import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { adaptors as queues } from '../providers/queue.provider';

export const BullBoardSetup = (app: INestApplication) => {
  const serverAdapter = new ExpressAdapter();

  createBullBoard({ queues, serverAdapter });

  serverAdapter.setBasePath('/bullboard');
  app.use('/bullboard', serverAdapter.getRouter());
};
