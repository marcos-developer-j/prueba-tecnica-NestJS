import { Injectable } from '@nestjs/common';
import { RecordsDto } from './dtos/json_body.dto';
import { response_body_DTO } from './dtos/response_body.dto';

@Injectable()
export class AppService {
  mapping(data: RecordsDto): response_body_DTO[] {
    return this.fillMapedObject(data);
  }

  fillMapedObject(original: RecordsDto): response_body_DTO[] {
    const out: response_body_DTO[] = [];
    original['Records'].map((record) => {
      const spam = record.ses.receipt.spamVerdict.status === 'PASS';
      const virus = record.ses.receipt.virusVerdict.status === 'PASS';
      const spf = record.ses.receipt.spfVerdict.status === 'PASS';
      const dkim = record.ses.receipt.dkimVerdict.status === 'PASS';
      const dmarc = record.ses.receipt.dmarcVerdict.status === 'PASS';
      const dns = spf && dkim && dmarc;
      const mes = new Date(record.ses.mail.timestamp).toLocaleString(
        'default',
        { month: 'long' },
      );
      const retrasado = record.ses.receipt.processingTimeMillis > 1000;
      const emisor = record.ses.mail.source.split('@')[0];
      const receptor = record.ses.mail.destination.map(
        (email) => email.split('@')[0],
      );
      out.push({
        spam,
        virus,
        dns,
        mes,
        retrasado,
        emisor,
        receptor,
      });
    });

    return out;
  }

  convertToJson(file: Express.Multer.File): RecordsDto {
    return JSON.parse(file.buffer.toString());
  }
}
