import { Injectable } from '@nestjs/common';
import { RecordsDto } from './dtos/json_body.dto';
import { response_body_DTO } from './dtos/response_body.dto';

@Injectable()
export class AppService {
  /**
   * The function "mapping" takes in a "RecordsDto" object and returns an array of "response_body_DTO"
   * objects.
   * @param {RecordsDto} data - The parameter "data" is of type "RecordsDto".
   * @returns An array of response_body_DTO objects.
   */
  mapping(data: RecordsDto): response_body_DTO[] {
    return this.fillMapedObject(data);
  }

  /**
   * The function takes an original object and maps its "Records" property to create a new array of
   * response_body_DTO objects with specific properties extracted from the original object.
   * @param {RecordsDto} original - The `original` parameter is of type `RecordsDto`.
   * @returns an array of response_body_DTO objects.
   */
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
}
