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

import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        // Verifica si el tipo de archivo es JSON
        if (file.mimetype !== 'application/json') {
          return callback(
            new BadRequestException('El archivo debe ser de tipo JSON'),
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
    res.status(200).send(file).end();
    try {
      const out = this.appService.mapping(this.appService.convertToJson(file));
      res.status(200).send(out).end();
    } catch (error) {
      res.status(500).send({ error: true, messaje: 'Error inesperado' });
    }
  }
}
