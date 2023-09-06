import { Controller, Get, OnModuleInit, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { get, set } from 'src/common/helpers/app.helper';
const { PROJECT_NAME } = process.env;

const time = Date.now();

@Controller()
export class BasePageController implements OnModuleInit {
  changelog: string;

  async onModuleInit() {
    const current = this.getCurrentChangeLogData();
    let old = await get(`changelog`);
    if (current) {
      if (!old) {
        old = JSON.stringify({ [time]: current });
        await set('changelog', old);
        this.changelog = this.generateChangeLogTemplate(JSON.parse(old));
      } else {
        const update = JSON.parse(old);
        update[time] = current;
        await set('changelog', JSON.stringify(update));
        this.changelog = this.generateChangeLogTemplate(update);
      }
    } else {
      this.changelog = this.generateChangeLogTemplate(JSON.parse(old || `{}`));
    }
  }

  @Get()
  @Throttle(120, 60)
  @ApiExcludeEndpoint()
  async root(@Res() res: Response) {
    res.header('Content-Security-Policy', '*');
    return res.render('index');
  }

  @Get('changelogs')
  @ApiExcludeEndpoint()
  async getChangelog(@Res() res: Response) {
    res.send(this.changelog);
  }

  // @Get('erd')
  // @ApiExcludeEndpoint()
  // async erd(@Res() res: Response) {
  //   return res.sendFile(join(process.cwd(), 'prisma/ERD.svg'));
  // }

  private getCurrentChangeLogData() {
    try {
      return `<h3>${new Date(time).toLocaleString()}</h3>${String(
        readFileSync('changelog', 'utf-8'),
      ).replace(/ \| /g, '<br>')}`;
    } catch {
      return null;
    }
  }

  private generateChangeLogTemplate(logs: Record<string, any>) {
    let msg = Object.keys(logs)
      .reverse()
      .map((key) => `${logs[key]}`)
      .join('<br>');
    msg = this.hyperLink(msg);
    return `<div style="font-family:Roboto, sans-serif;"><center><h1>${PROJECT_NAME} CHANGELOGS</h1></center><div style="margin:0 20px;text-align: center;overflow: scroll;height: 90vh;background-color: #f2f2f2;">${msg}</div></div>`;
  }
  private hyperLink(msg: string) {
    const regex = /(?:\bPROJECT_NAME\w+\b)/g;

    const replacedString = msg.replace(regex, (match) => {
      const word = match.substring(4);
      const link = `https://radiansys.atlassian.net/browse/${PROJECT_NAME}-${word}`;
      return `<a href="${link}" target="_blank">${match}</a>`;
    });

    return replacedString;
  }
}
