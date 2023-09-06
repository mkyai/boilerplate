import { BullAdapter } from '@bull-board/api/bullAdapter';
import * as Queue from 'bull';
import { FIRESTORE_QUEUE, MAIL_QUEUE } from '../constants/app.constants';
const { REDIS_HOST, REDIS_USERNAME, REDIS_PORT, REDIS_PASSWORD } = process.env;

export const redisConfig = {
  redis: {
    host: REDIS_HOST,
    username: REDIS_USERNAME,
    port: parseInt(`${REDIS_PORT}`),
    password: REDIS_PASSWORD,
  },
};

export const queueNames = [MAIL_QUEUE, FIRESTORE_QUEUE];

export const queueRegister = queueNames.map((name) => ({
  name,
}));

export const queues = queueNames.map((m) => new Queue(m, redisConfig));

export const adaptors = queues.map((m) => new BullAdapter(m));
