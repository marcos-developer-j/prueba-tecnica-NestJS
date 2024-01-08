import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AttachmentDto } from './models/attachmentDto.dto';
import * as mailparser from 'mailparser';
import * as fs from 'fs';
@Injectable()
export class AppService {
  logger: Logger;
  constructor(private httpsService: HttpService) {
    this.logger = new Logger(AppService.name);
  }
  getHello(): string {
    return 'Hello World!';
  }
  /**
   * The function `getEmailfromUrl` checks if an email file exists at a given URL, first by checking
   * the web file and then by checking the local file.
   * @param {string} url - The `url` parameter is a string that represents the URL of a file.
   * @returns an object with properties "error" and "message".
   */
  async getEmailfromUrl(url: string) {
    if (!url.endsWith('.eml'))
      throw new InternalServerErrorException(
        'The url or path file does not reference an email file',
      );
    const response = await this.checkWebFile(url);
    if (response.error) {
      const response = await this.checkLocalFile(url);
      if (response.error) {
        return { error: true, message: 'Any email file found' };
      }
      return response;
    }
    return response;
  }
  /**
   * The function `checkLocalFile` reads a local file and returns its content or an error message.
   * @param {string} url - The `url` parameter is a string that represents the file path or URL of the
   * local file you want to check.
   * @returns The function `checkLocalFile` returns a Promise that resolves to an object with
   * properties `error` and `message`.
   */
  async checkLocalFile(url: string): Promise<any> {
    const response = new Promise((resolve, reject) => {
      fs.readFile(url, 'utf-8', (error, data) => {
        if (error) {
          reject({ error: true, message: error });
          return;
        }
        resolve({ error: false, message: data });
      });
    });
    return response;
  }
  /**
   * The function `checkWebFile` is an asynchronous function that checks a web file by making an HTTP
   * GET request to the specified URL and returns the data if successful, or an error message if there
   * is an error.
   * @param {string} url - The `url` parameter is a string that represents the URL of the web file that
   * you want to check.
   * @returns the data fetched from the specified URL if the request is successful. If there is an
   * error, it returns an object with an error flag set to true and a corresponding error message.
   */
  async checkWebFile(url: string) {
    try {
      const { data } = await firstValueFrom(this.httpsService.get(url));
      return data;
    } catch (error) {
      return {
        error: true,
        message: 'error al traer el Email. No existe o no tiene permisos',
      };
    }
  }

  /**
   * The function `resolveEmailJsons` takes an email content as input, parses it using the `mailparser`
   * library, extracts the body and attachments, and returns a JSON object containing the final URLs.
   * @param {string} emailContent - The emailContent parameter is a string that represents the content
   * of an email.
   * @returns The function `resolveEmailJsons` is returning a promise that resolves to the `response`
   * variable.
   */
  async resolveEmailJsons(emailContent: string) {
    const response = await new Promise((resolve, reject) => {
      mailparser.simpleParser(emailContent, async (err, email) => {
        if (err) {
          this.logger.error('Error al analizar el email:', err);
          reject(err);
          return;
        }
        const body = email.text;
        const attachments = email.attachments;
        const out = await this.finalUrlsJson(body, attachments);
        resolve(out);
      });
    });
    return response;
  }
  /**
   * The function converts the content of a file from a string to JSON format.
   * @param {AttachmentDto} file - The `file` parameter is of type `AttachmentDto`. It represents an
   * attachment file that contains data in a specific format.
   * @returns the parsed JSON data.
   */
  convertToJson(file: AttachmentDto) {
    const dataString = file.content.toString('utf-8');
    const dataJson = JSON.parse(dataString);
    return dataJson;
  }
  /**
   * The function checks if a given string contains any URLs and returns an array of the URLs found.
   * @param {string} dataBody - The parameter `dataBody` is a string that represents the body of some
   * data.
   * @returns The function `checkBodyUrls` returns an array of URLs if there are any URLs present in
   * the `dataBody` string. If there are no URLs, it returns `null`.
   */
  checkBodyUrls(dataBody: string) {
    const expresionRegular = /https:\/\/[^\s]+/g;
    const includes = expresionRegular.test(dataBody);
    const coincidencias = dataBody.match(expresionRegular);
    return includes ? coincidencias : null;
  }

  /**
   * The function `checkedOut` takes an array of URLs, checks them for JSON and another type of URL,
   * and returns an object containing the checked URLs.
   * @param {string[]} urls - An array of strings representing URLs.
   * @returns an object with two properties: "jsonUrls" and "anotherUrls". The values of these
   * properties are the results of calling the "checkJsonUrls" and "checkAnotherUrls" functions
   * respectively.
   */
  checkedOut(urls: string[]) {
    const jsonUrls = this.checkJsonUrls(urls);
    const anotherUrls = this.checkAnotherUrls(urls);
    return {
      jsonUrls,
      anotherUrls,
    };
  }

  /**
   * The function filters an array of strings to only include elements that contain the substring
   * '.json'.
   * @param {string[]} data - An array of strings that represent URLs.
   * @returns an array of strings that contain the substring '.json'.
   */
  checkJsonUrls(data: string[]) {
    const out = data.filter((element) => element.includes('.json'));
    return out;
  }
  /**
   * The function filters out elements from an array that do not include the string '.json'.
   * @param {string[]} data - An array of strings that represent URLs.
   * @returns The function `checkAnotherUrls` returns an array of strings that do not include the
   * substring '.json'.
   */
  checkAnotherUrls(data: string[]) {
    const out = data.filter((element) => !element.includes('.json'));
    return out;
  }

  /**
   * The `finalUrlsJson` function takes a data body and a list of attachments, searches for URLs in the
   * body, separates them into different categories, searches for JSON information in the URLs,
   * searches for JSON information in other pages, and retrieves information from the attachments, then
   * returns all the JSON information found.
   * @param {string} dataBody - A string representing the body of the data.
   * @param {AttachmentDto[]} attachments - An array of AttachmentDto objects.
   * @returns an object with three properties: "JsonInBody", "JsoninPages", and "JsonAttachments".
   */
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
  /**
   * The function `searchJson` asynchronously searches for JSON data from multiple URLs and returns an
   * array of objects containing the URL and the corresponding data.
   * @param {string[]} urlJson - An array of URLs pointing to JSON files.
   * @returns an array of objects, where each object contains the URL and the data retrieved from that
   * URL.
   */
  async searchJson(urlJson: string[]) {
    const out = [];
    try {
      for (const url of urlJson) {
        const { data } = await firstValueFrom(this.httpsService.get(url));
        out.push({ url, data });
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return out;
  }
  /**
   * The function `checkPages` takes an array of strings as input and returns an array of objects
   * containing the page and URLs found in the data of each page.
   * @param {string[]} info - An array of strings representing different pages.
   * @returns The function `checkPages` returns a promise that resolves to an array of objects. Each
   * object in the array has two properties: `page` (a string) and `urls` (an array of strings).
   */
  async checkPages(
    info: string[],
  ): Promise<{ page: string; urls: string[] }[]> {
    try {
      const out: { page: string; urls: string[] }[] = [];
      for (const page of info) {
        const { data } = await firstValueFrom(this.httpsService.get(page));
        if (/https:\/\/.*\.json/g.test(data)) {
          const preUrls = data.match(/https:\/\/[^\s]+\.json/g);
          const addUrls: string[] = [...new Set(preUrls)] as string[];
          out.push({ page, urls: addUrls });
        }
      }
      return out;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * The function `searchJsonInPage` takes an array of objects containing page and URL information, and
   * returns an array of objects containing page URL and corresponding JSON data.
   * @param {{ page: string; urls: string[] }[]} urlJson - An array of objects containing information
   * about the pages and their corresponding URLs. Each object has two properties: "page" (string) and
   * "urls" (array of strings).
   * @returns The function `searchJsonInPage` returns a Promise that resolves to an array of objects.
   * Each object in the array represents a page and contains two properties: `page` and `infoPage`. The
   * `page` property is a string representing the page URL, and the `infoPage` property is an array of
   * objects. Each object in the `infoPage` array represents a URL and its
   */
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
  /**
   * The function takes an array of AttachmentDto objects, converts each object to JSON format, and
   * returns an array of objects containing the filename and converted data.
   * @param {AttachmentDto[]} files - An array of AttachmentDto objects. Each object represents a file
   * and has the following properties:
   * @returns an array of objects, where each object has a "name" property of type string and a "data"
   * property of type object.
   */
  getInfoAttachments(files: AttachmentDto[]): { name: string; data: object }[] {
    const attachments = [];
    for (const file of files) {
      const infofile = this.convertToJson(file);
      attachments.push({ name: file.filename, data: infofile });
    }
    return attachments;
  }
}
