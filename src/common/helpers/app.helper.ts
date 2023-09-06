import { Encrypter } from './encrypt.helper';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import Redis from 'ioredis';
import { isDate, round } from 'lodash';
import { join } from 'path';
import { OTP_USE } from '../constants/app.constants';
import { redisConfig } from '../providers/queue.provider';
const {
  JWT_SECRET,
  ENCRYPTION_KEY,
  BASE_URL,
  AWS_BUCKET_URL,
  FRONTEND_URL,
  AWS_BUCKET,
} = process.env;
const redis = new Redis(redisConfig.redis);

export const get = async (key: string) => redis.get(key);
export const set = async (key: string, value: string, ttl?: number) =>
  ttl ? redis.set(key, value, 'EX', ttl) : redis.set(key, value);
export const del = async (key: string) => redis.del(key);

export const encrypt = (value: string): string =>
  new Encrypter(
    <string>ENCRYPTION_KEY || 'default_encryption_key_#!@#$Abc123',
  ).encryptIv(value);
export const decrypt = (value: string): string =>
  new Encrypter(
    <string>ENCRYPTION_KEY || 'default_encryption_key_#!@#$Abc123',
  ).dencryptIv(value);

export function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}

export const toSnakeCase = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (isDate(obj)) return obj.toISOString();

  if (Array.isArray(obj)) {
    return obj.map((item) => toSnakeCase(item));
  }

  return Object.entries(obj).reduce((acc: any, [key, value]) => {
    if (key === 'password') {
      return acc;
    }
    const snakeCaseKey = key.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`,
    );
    acc[snakeCaseKey] = typeof value === 'object' ? toSnakeCase(value) : value;

    return acc;
  }, {});
};

export const urlPath = (path: string, availability?: number) => {
  if (path.startsWith('http') || path.startsWith('https')) {
    return path;
  }
  const basePath = availability === 0 ? BASE_URL : AWS_BUCKET_URL;
  return `${basePath}/${path}`;
};

export const getClassName = (name: string): string =>
  name
    .replace('Dto', '')
    .replace('Create', '')
    .replace('Update', '')
    .toLowerCase();

export const createUrlFromPath = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (isDate(obj)) return obj.toISOString();

  if (Array.isArray(obj)) {
    return obj.map((item) => createUrlFromPath(item));
  }

  return Object.entries(obj).reduce((acc: any, [key, value]) => {
    if (key === 'url') {
      acc[key] = urlPath(String(value), obj['availability']);
      return acc;
    }
    acc[key] = typeof value === 'object' ? createUrlFromPath(value) : value;

    return acc;
  }, {});
};

export const getAttachmentUrl = (key: string, bucket = AWS_BUCKET) => {
  if (key.startsWith('http') || key.startsWith('https')) {
    return key;
  }
  return `https://${bucket}.s3.amazonaws.com/resources/${key}`;
};

export const formatBytes = (bytes?: number) => {
  if (!bytes) return null;
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
};

export const getAttachmentType = (type?: string) => {
  if (!type) return undefined;
  if (type.startsWith('image')) return 'image';
  if (type.startsWith('video')) return 'video';
  return 'file';
};

export const getSharableLink = (
  id: number,
  type: string,
  tenant: string = 'public',
) =>
  `${BASE_URL}/share/${encrypt(JSON.stringify({ id, type }))}`.replace(
    '//',
    `//${tenant}.`,
  );

export const getQRCode = (id: number) => encrypt(JSON.stringify({ id }));
export const getQRUserId = (code: string) => JSON.parse(decrypt(code)).id;

export const getRequestId = (c = 3) =>
  [
    Math.random()
      .toString(36)
      .replace(/[^a-z]/g, '')
      .substring(0, c),
    Date.now(),
  ].join('');

export const isLogin = (req: Request) => req.url.split('/').pop() !== 'login';

export const imageKeyNormalize = (key?: string) => {
  if (!key) return '';
  return key.toLowerCase().replace(/\s/g, '-');
};

export const processLabels = (labels: Record<string, any>[]) => {
  const result: Record<string, any> = {};
  for (let label of labels) {
    result[label.Name] = round(label.Confidence);
  }
  return result;
};

export const getFilePath = (url: string) =>
  join(process.cwd(), url.replace(<string>BASE_URL, ''));

export const getOtp = (): number => Math.floor(100000 + Math.random() * 900000);

export const setOtp = async (email: string, type: OTP_USE) => {
  const path = [email, '_', type].join('');
  let otp = await get(path);
  if (!otp) {
    otp = `${getOtp()}`;
    await set(path, otp, 60 * 3);
  }
  return otp;
};

export const Includables = (...fields: string[]) =>
  Object.fromEntries(fields.map((key) => [key, true]));

export const Omit = (obj: Record<string, any>, key: string) =>
  (({ [key]: _, ...rest }) => rest)(obj);

export const createInvitationToken = (tenantId?: string, email?: string) =>
  new JwtService().sign(
    {
      tenantId,
      email,
    },
    {
      expiresIn: '7d',
      secret: JWT_SECRET,
    },
  );

export const getInvitationUrl = (tenantId?: string, email?: string) =>
  `${FRONTEND_URL}/join/token=${createInvitationToken(tenantId, email)}`;

export const createSharableLink = (
  resp: Record<string, any>,
  req: Record<string, any>,
) => {
  if (!req.contentSharable || resp.identifier) return resp;
  const match = req.url.match(/\/api\/v1\/([^/]+)\//);
  resp['share'] = getSharableLink(
    resp.id,
    match ? match[1] : 'default',
    <string>req.headers['x-tenant-id'],
  );

  return resp;
};

export const responseLangauge = (
  resp: Record<string, any>,
  req: Record<string, any>,
) => {
  const prefered = req.headers['language'];
  if (!prefered || prefered === 'en') {
    return resp;
  }
  return resp;
};
