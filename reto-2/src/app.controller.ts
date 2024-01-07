import {
  BadRequestException,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as mailparser from 'mailparser';
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
  async mapping(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      const contenidoEml = file.buffer.toString('utf-8');
      let out = null;
      mailparser.simpleParser(contenidoEml, async (err, email) => {
        if (err) {
          console.error('Error al analizar el email:', err);
          return;
        }
        const body = email.text;
        const attachments = email.attachments;
        out = await this.appService.finalUrlsJson(body, attachments);
      });
      res.status(200).send({ error: false, data: out });
    } catch (error) {
      res.status(500).send({ error: true, messaje: 'Error inesperado' });
    }
  }
}
