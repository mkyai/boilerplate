import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
// IMPORT_DYNAMIC_MODULE

@Module({
  imports: [
    AuthModule,
    // DYNAMIC_MODULE
  ],
})
export default class ServicesModule {}
