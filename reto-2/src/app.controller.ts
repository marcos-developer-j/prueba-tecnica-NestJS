import {
  BadRequestException,
  Controller,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';
import { HttpService } from '@nestjs/axios';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private httpService: HttpService,
  ) {}
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        // Verifica si el tipo de archivo es JSON
        if (file.mimetype !== 'message/rfc822') {
          return callback(
            new BadRequestException('El archivo debe ser de tipo .eml'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async resolveEmail(
    @Res() res: Response,
    @UploadedFile() file?: Express.Multer.File,
    @Query('url') url?: string,
  ) {
    try {
      if ((file && url) || (!file && !url)) {
        res
          .status(500)
          .send({
            error: true,
            messaje: `Error: Two options: attach email file or use ?url=your-url-or-path.${
              file && url
                ? 'Both at the same time invalid'
                : 'You must enter one'
            }   `,
          })
          .end();
        return;
      }
      const emailContent = url
        ? await this.appService.getEmailfromUrl(url)
        : file.buffer.toString('utf-8');
      const response = await this.appService.resolveEmailJsons(emailContent);
      res
        .status(200)
        .send({ error: false, from: url ? url : 'file', data: response });
      return;
    } catch (error) {
      res.status(500).send({ error: true, messaje: error.message || error });
      return;
    }
  }
}
