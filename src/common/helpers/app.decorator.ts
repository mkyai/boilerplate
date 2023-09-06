import {
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ContentSharable } from '../interceptors/content-sharable.interceptor';

export const ApiFiles = (filename: string): MethodDecorator =>
  applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [filename]: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    }),
  );

export const ApiFile = (filename: string): MethodDecorator =>
  applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [filename]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );

export const Sharable = (): MethodDecorator =>
  applyDecorators(UseInterceptors(ContentSharable));
