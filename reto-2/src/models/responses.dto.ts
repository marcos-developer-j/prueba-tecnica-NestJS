import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class error_response_DTO {
  @IsString()
  error: boolean;
  @IsNotEmpty()
  message: any;
}

export class success_response_DTO {
  @IsObject()
  JsonInBody: object;
  @IsObject()
  JsoninPages: object;
  @IsObject()
  JsonAttachments: object;
}
