import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateSmtpEmail,
  SendSmtpEmail,
  TransactionalEmailsApi,
} from '@sendinblue/client';
import * as http from 'http';

export class EmailApi extends TransactionalEmailsApi {
  sendEmail: (sendSmtpEmail: SendSmtpEmail, options?: any) => Promise<any>;
}

type EmailResponse = {
  response: http.IncomingMessage;
  body: CreateSmtpEmail;
};

export const MailProvider: FactoryProvider<EmailApi> = {
  provide: EmailApi,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const instance = new EmailApi();
    instance.setApiKey(0, config.get('SENDINBLUE_API_KEY', ''));
    instance.sendEmail = async (data: any): Promise<EmailResponse> => {
      return new Promise((resolve, reject) => {
        instance
          .sendTransacEmail({
            ...data,
            sender: {
              name: config.get('MAIL_FROM_NAME', ''),
              email: config.get('MAIL_FROM', ''),
            },
          })
          .then(
            (response: any) => {
              resolve(response);
            },
            (error: any) => {
              reject(error);
            },
          );
      });
    };
    return instance;
  },
};
