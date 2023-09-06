import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { upperFirst } from 'lodash';
import {
  MAIL_QUEUE,
  MAIL_SUBJECT,
  MAIL_TYPE,
  OTP_MAIL,
  OTP_USE,
  SEND_MAIL,
} from 'src/common/constants/app.constants';
import { getInvitationUrl, setOtp } from 'src/common/helpers/app.helper';

type MAIL_EVENT_TYPE = {
  email: string;
  type: MAIL_TYPE;
  payload?: Record<string, any>;
};

@Injectable()
export class MailListner {
  constructor(@InjectQueue(MAIL_QUEUE) private queue: Queue) {}

  @OnEvent(SEND_MAIL)
  async addMailToQueue({ email, type }: MAIL_EVENT_TYPE) {
    const [subject, htmlContent] = await this.resolveMailType(email, type);
    await this.queue.add(SEND_MAIL, {
      htmlContent,
      subject,
      to: [{ email }],
    });
  }

  @OnEvent(OTP_MAIL)
  async addOtpMailToQueue({ email, type }: MAIL_EVENT_TYPE) {
    const [subject, htmlContent] = await this.resolveMailType(email, type);
    await this.queue.add(OTP_MAIL, {
      htmlContent,
      subject,
      to: [{ email }],
    });
  }

  private async resolveMailType(
    email: string,
    type: MAIL_TYPE,
    payload?: Record<string, any>,
  ): Promise<[string, string]> {
    //@ts-ignore
    const subject = MAIL_SUBJECT[type];
    let html;
    const name = String(email).split('@')[0];
    if (type !== MAIL_TYPE.INVITATION) {
      const otp = await setOtp(email, OTP_USE[type]);
      html = `<h1>Hi ${name},</h1>Your 6 digit OTP is <h2><b>${otp}</b></h2>`;
    } else {
      const community = upperFirst(String(payload?.tenant)?.split('-')[0]);
      html = `<h1>Hi ${name},</h1>You are invited to join <b>${community}</b> please click on the link below to join <h2>
      <b><a href=${getInvitationUrl(
        payload?.tenant,
        payload?.email,
      )}>Click Here</a></b></h2>`;
    }
    return [subject, html];
  }
}
