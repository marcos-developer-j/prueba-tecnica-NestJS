import { Body, Controller, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';

import { Response } from 'express';
import { RecordsDto } from './dtos/json_body.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post()
  async mapping(@Body() body: RecordsDto, @Res() res: Response) {
    try {
      const out = this.appService.mapping(body);
      res.status(200).send(out).end();
    } catch (error) {
      res.status(500).send({
        error: true,
        messaje: 'Error inesperado-> ' + error,
      });
    }
  }
}
