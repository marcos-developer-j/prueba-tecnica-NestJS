import { IsArray, IsBoolean, IsString } from 'class-validator';

export class response_body_DTO {
  @IsBoolean()
  spam: boolean;
  @IsBoolean()
  virus: boolean;
  @IsBoolean()
  dns: boolean;
  @IsString()
  mes: string;
  @IsBoolean()
  retrasado: boolean;
  @IsString()
  emisor: string;
  @IsArray()
  @IsString({ each: true })
  receptor: string[];
}
