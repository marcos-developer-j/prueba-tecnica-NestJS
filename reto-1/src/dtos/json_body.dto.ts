import {
  IsArray,
  IsBoolean,
  IsISO8601,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class VerdictDto {
  @IsString()
  status: string;
}
export class ActionDto {
  @IsString()
  type: string;
  @IsString()
  topicArn: string;
}
export class ReceiptDto {
  @IsISO8601()
  timestamp: string;
  @IsNumber()
  processingTimeMillis: number;
  @IsArray()
  @IsString({ each: true })
  recipients: string[];
  @ValidateNested()
  spamVerdict: VerdictDto;
  @ValidateNested()
  virusVerdict: VerdictDto;
  @ValidateNested()
  spfVerdict: VerdictDto;
  @ValidateNested()
  dkimVerdict: VerdictDto;
  @ValidateNested()
  dmarcVerdict: VerdictDto;
  @ValidateNested()
  dmarcPolicy: string;
  @ValidateNested()
  action: ActionDto;
}

export class HeaderDto {
  @IsString()
  name: string;
  @IsString()
  value: string;
}

export class CommonHeadersDto {
  @IsString()
  returnPath: string;
  @IsString()
  @ValidateNested({ each: true })
  from: string[];
  @IsISO8601()
  date: string;
  @IsString()
  @ValidateNested({ each: true })
  to: string[];
  @IsString()
  messageId: string;
  @IsString()
  subject: string;
}
export class MailDto {
  @IsISO8601()
  timestamp: string;
  @IsString()
  source: string;
  @IsString()
  messageId: string;
  @IsArray()
  @IsString({ each: true })
  destination: string[];
  @IsBoolean()
  headersTruncated: boolean;
  @IsArray()
  @ValidateNested({ each: true })
  headers: HeaderDto[];
  @ValidateNested()
  commonHeaders: CommonHeadersDto;
}
export class SesDto {
  @ValidateNested()
  receipt: ReceiptDto;
  @ValidateNested()
  mail: MailDto;
}
export class RecordDto {
  @IsString()
  'eventVersion': string;
  @ValidateNested()
  ses: SesDto;
  @IsString()
  'eventSource': string;
}
export class RecordsDto {
  @IsArray()
  @ValidateNested({ each: true })
  'Records': RecordDto[];
}
