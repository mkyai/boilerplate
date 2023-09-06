import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export const Lowercase = () =>
  applyDecorators(
    Transform(({ value }) => (value ? value.toLowerCase() : value)),
  );
