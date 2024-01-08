import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString } from 'class-validator';

export class response_body_DTO {
  @ApiProperty()
  @IsBoolean()
  spam: boolean;
  @ApiProperty()
  @IsBoolean()
  virus: boolean;
  @ApiProperty()
  @IsBoolean()
  dns: boolean;
  @ApiProperty()
  @IsString()
  mes: string;
  @ApiProperty()
  @IsBoolean()
  retrasado: boolean;
  @ApiProperty()
  @IsString()
  emisor: string;
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  receptor: string[];
}
export class error_response_DTO {
  @ApiProperty()
  @IsBoolean()
  error: boolean;
  @ApiProperty()
  @IsString()
  message: string;
}
