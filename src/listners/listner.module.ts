import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailProvider } from 'src/common/providers/mail.provider';
import {
  queueRegister,
  redisConfig,
} from 'src/common/providers/queue.provider';
import { MailListner } from './mail/mail.listner';
import { MailProcessor } from './mail/mail.processor';

@Module({
  imports: [
    BullModule.forRoot(redisConfig),

    BullModule.registerQueue(...queueRegister),
  ],
  providers: [
    MailListner,
    MailProcessor,
    MailProvider,
  ],
})
export class ListnerModule {}
