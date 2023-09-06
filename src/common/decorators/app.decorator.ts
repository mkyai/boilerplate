import { applyDecorators, UseGuards } from '@nestjs/common';
import { SocialAuthGuard } from 'src/common/guards/social-auth.guard';

export const SocialAuth = () => applyDecorators(UseGuards(SocialAuthGuard));
