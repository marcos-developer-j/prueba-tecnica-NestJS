import {
  IsArray,
  IsBoolean,
  IsISO8601,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class VerdictDto {
  @ApiProperty()
  @IsString()
  status: string;
}
export class ActionDto {
  @ApiProperty()
  @IsString()
  type: string;
  @IsString()
  @ApiProperty()
  topicArn: string;
}
export class ReceiptDto {
  @ApiProperty()
  @IsISO8601()
  timestamp: string;
  @ApiProperty()
  @IsNumber()
  processingTimeMillis: number;
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  recipients: string[];
  @ApiProperty({ type: VerdictDto })
  @ValidateNested()
  spamVerdict: VerdictDto;
  @ApiProperty({ type: VerdictDto })
  @ValidateNested()
  virusVerdict: VerdictDto;
  @ApiProperty({ type: VerdictDto })
  @ValidateNested()
  spfVerdict: VerdictDto;
  @ApiProperty({ type: VerdictDto })
  @ValidateNested()
  dkimVerdict: VerdictDto;
  @ApiProperty({ type: VerdictDto })
  @ValidateNested()
  dmarcVerdict: VerdictDto;
  @ApiProperty()
  @ValidateNested()
  dmarcPolicy: string;
  @ApiProperty({ type: ActionDto })
  @ValidateNested()
  action: ActionDto;
}

export class HeaderDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  value: string;
}

export class CommonHeadersDto {
  @ApiProperty()
  @IsString()
  returnPath: string;
  @ApiProperty()
  @IsString()
  @ValidateNested({ each: true })
  from: string[];
  @ApiProperty()
  @IsISO8601()
  date: string;
  @ApiProperty()
  @IsString()
  @ValidateNested({ each: true })
  to: string[];
  @ApiProperty()
  @IsString()
  messageId: string;
  @ApiProperty()
  @IsString()
  subject: string;
}
export class MailDto {
  @ApiProperty()
  @IsISO8601()
  timestamp: string;
  @ApiProperty()
  @IsString()
  source: string;
  @ApiProperty()
  @IsString()
  messageId: string;
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  destination: string[];
  @ApiProperty()
  @IsBoolean()
  headersTruncated: boolean;
  @ApiProperty({ type: [HeaderDto] })
  @IsArray()
  @ValidateNested({ each: true })
  headers: HeaderDto[];
  @ApiProperty({ type: CommonHeadersDto })
  @ValidateNested()
  commonHeaders: CommonHeadersDto;
}
export class SesDto {
  @ApiProperty({ type: ReceiptDto })
  @ValidateNested()
  receipt: ReceiptDto;
  @ApiProperty({ type: MailDto })
  @ValidateNested()
  mail: MailDto;
}
export class RecordDto {
  @ApiProperty()
  @IsString()
  'eventVersion': string;
  @ApiProperty({ type: SesDto })
  @ValidateNested()
  ses: SesDto;
  @ApiProperty()
  @IsString()
  'eventSource': string;
}
export class RecordsDto {
  @ApiProperty({ type: RecordDto })
  @IsArray()
  @ValidateNested({ each: true })
  'Records': RecordDto[];
}
