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
