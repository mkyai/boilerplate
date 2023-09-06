import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Job } from 'bull';
import { MAIL_QUEUE, OTP_MAIL } from 'src/common/constants/app.constants';
import { EmailApi } from 'src/common/providers/mail.provider';

@Processor(MAIL_QUEUE)
export class MailProcessor {
  constructor(private mailClient: EmailApi) {}

  @Process(OTP_MAIL)
  async updateAttachment(job: Job) {
    Logger.log(
      `Processing mail job ${job.id} with data ${JSON.stringify(job.data)}`,
    );
    try {
      const sendMail = await this.mailClient.sendEmail(job.data);
      const resp = sendMail.response.toJSON();
      if (resp.statusCode === 201) {
        job.moveToCompleted(
          JSON.stringify({ messageId: resp?.body?.messageId }),
        );
        // TODO: set redis job for logging
      } else {
        job.moveToFailed({ message: resp });
      }
    } catch (e) {
      Logger.error(`Mail job failed ${JSON.stringify(e?.message || e)}`);
    }
  }

  @OnQueueCompleted()
  async onComplete(job: Job) {
    Logger.log(`Notification queue [Mail] completed the job with id ${job.id}`);
  }

  @OnQueueFailed()
  async onFailed(job: Job) {
    Logger.log(
      `Notification queue [Mail] job failed, : ${job.id} , ${JSON.stringify(
        job,
      )}}`,
    );
  }

  private async getClient(tenant: string) {
    const url = process.env.DATABASE_URL!.replace(
      <string>process.env.DATABASE_NAME,
      tenant,
    );

    return new PrismaClient({
      datasources: {
        db: { url },
      },
    });
  }

  private async dumpClient(client: PrismaClient) {
    await client.$disconnect();
  }
}
