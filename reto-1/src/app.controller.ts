import { Body, Controller, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';

import { Response } from 'express';
import { RecordsDto } from './dtos/json_body.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  error_response_DTO,
  response_body_DTO,
} from './dtos/response_body.dto';
@ApiTags('Mapping')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @ApiOperation({
    summary: 'Resumen de la operación',
    description: 'Endpoint para subir un JSON con un formato designado, mapearlo y devolverlos en un diferente formato',
  })
  @ApiResponse({
    status: 200,
    description: 'Descripción exitosa',
    type: response_body_DTO,
  }) // Ajusta TuTipoDeRespuestaDto según tu caso
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    type: error_response_DTO,
  }) // Ajusta ErrorDto según tu caso
  @ApiBody({
    type: RecordsDto,
    description: 'Descripción del cuerpo de la solicitud',
  }) // Ajusta RecordsDto según tu caso
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
