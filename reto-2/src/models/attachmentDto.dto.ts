import { ApiProperty } from '@nestjs/swagger';

export class AttachmentDto {
  type: string;
  content: Buffer;
  contentType: string;
  partId: string;
  release: null | any;
  contentDisposition: string;
  filename: string;
  contentId: string;
  cid: string;
  headers: Map<string, any>;
  checksum: string;
  size: number;
}

export class fileUploadDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
