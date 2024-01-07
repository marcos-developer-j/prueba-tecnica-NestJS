import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AttachmentDto } from './models/attachmentDto.dto';

@Injectable()
export class AppService {
  constructor(private httpsService: HttpService) {}
  getHello(): string {
    return 'Hello World!';
  }
  convertToJson(file: AttachmentDto) {
    const dataString = file.content.toString('utf-8');
    const dataJson = JSON.parse(dataString);
    return dataJson;
  }
  checkBodyUrls(dataBody: string) {
    const expresionRegular = /https:\/\/.*/g;
    const includes = expresionRegular.test(dataBody);
    const coincidencias = dataBody.match(expresionRegular);
    return includes ? coincidencias : null;
  }

  checkedOut(urls: string[]) {
    const jsonUrls = this.checkJsonUrls(urls);
    const anotherUrls = this.checkAnotherUrls(urls);
    return {
      jsonUrls,
      anotherUrls,
    };
  }

  checkJsonUrls(data: string[]) {
    const out = data.filter((element) => element.includes('.json'));
    return out;
  }
  checkAnotherUrls(data: string[]) {
    const out = data.filter((element) => !element.includes('.json'));
    return out;
  }

  async finalUrlsJson(
    dataBody: string,
    attachments: AttachmentDto[],
  ): Promise<{
    JsonInBody: object;
    JsoninPages: object;
    JsonAttachments: object;
  }> {
    const findUrlsinBody = this.checkBodyUrls(dataBody);
    const separeDefinitions = this.checkedOut(findUrlsinBody);
    const jsonUrlsInfo = await this.searchJson(separeDefinitions.jsonUrls);
    const anotherPagesUrls = await this.searchJsonInPage(
      await this.checkPages(separeDefinitions.anotherUrls),
    );
    const jsonAttachments = this.getInfoAttachments(attachments);
    const allJsoninfo = {
      JsonInBody: jsonUrlsInfo,
      JsoninPages: anotherPagesUrls,
      JsonAttachments: jsonAttachments,
    };
    return allJsoninfo;
  }
  async searchJson(urlJson: string[]) {
    const out = [];
    for (const url in urlJson) {
      const { data } = await firstValueFrom(this.httpsService.get(url));
      out.push({ url, data });
    }
    return out;
  }
  async checkPages(
    info: string[],
  ): Promise<{ page: string; urls: string[] }[]> {
    const out: { page: string; urls: string[] }[] = [];
    for (const page in info) {
      const { data } = await firstValueFrom(this.httpsService.get(page));
      if (/https:\/\/.*\.json/g.test(data))
        out.push({ page, urls: data.match(/https:\/\/.*\.json/g) });
    }
    return out;
  }

  async searchJsonInPage(
    urlJson: { page: string; urls: string[] }[],
  ): Promise<{ page: { url: string; data: object[] } }[]> {
    const out = [];
    for (const { page, urls } of urlJson) {
      const infoPage = [];
      for (const url of urls) {
        const { data } = await firstValueFrom(this.httpsService.get(url));
        infoPage.push({ url, data });
      }
      out.push({ page, infoPage });
    }
    return out;
  }
  checkAttachments(files: AttachmentDto[]) {
    const jsonAttachments = files.filter(
      (attachement) => attachement?.contentType === 'application/json',
    );
    return jsonAttachments;
  }
  getInfoAttachments(files: AttachmentDto[]): { name: string; data: object }[] {
    const attachments = [];
    for (const file of files) {
      const infofile = this.convertToJson(file);
      attachments.push({ name: file.filename, data: infofile });
    }
    return attachments;
  }
}
