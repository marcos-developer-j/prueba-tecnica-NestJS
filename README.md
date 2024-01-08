# Prueba Tecnica NestJS

https://test-backups-memgraph.s3.amazonaws.com/ses-sns-event.json

Se desarrollaron los dos retos: A continuacion se mostraran los pasos para el funcionamiento del ambos retos

Primero que todo descargue el repositorio, acceda a cada carpeta del respectivo reto.

Acceda a la consola y ubiquese en el directorio donde esta el reto y dijite:

    npm install

Haga los mismo para el reto 2

Una vez que se hayan descargado los paquetes nuevamente en la cosola en cada uno de los directorios de los retos dijite:

    npm run start


# Reto 1

Para este reto la manera para cargar archivos .json se realizara de la siguiente forma

``````
curl --location 'http://localhost:3000' \
--header 'Content-type: application/json' \
--data-raw '{
  "Records": [
    {
      "eventVersion": "1.0",
      "ses": {
        "receipt": {
          "timestamp": "2015-09-11T20:32:33.936Z",
          "processingTimeMillis": 222,
          "recipients": [
            "recipient@example.com"
          ],
          "spamVerdict": {
            "status": "PASS"
          },
          "virusVerdict": {
            "status": "PASS"
          },
          "spfVerdict": {
            "status": "PASS"
          },
          "dkimVerdict": {
            "status": "PASS"
          },
          "dmarcVerdict": {
            "status": "PASS"
          },
          "dmarcPolicy": "reject",
          "action": {
            "type": "SNS",
            "topicArn": "arn:aws:sns:us-east-1:012345678912:example-topic"
          }
        },
        "mail": {
          "timestamp": "2015-09-11T20:32:33.936Z",
          "source": "61967230-7A45-4A9D-BEC9-87CBCF2211C9@example.com",
          "messageId": "d6iitobk75ur44p8kdnnp7g2n800",
          "destination": [
            "recipient@example.com"
          ],
          "headersTruncated": false,
          "headers": [
            {
              "name": "Return-Path",
              "value": "<0000014fbe1c09cf-7cb9f704-7531-4e53-89a1-5fa9744f5eb6-000000@amazonses.com>"
            },
            {
              "name": "Received",
              "value": "from a9-183.smtp-out.amazonses.com (a9-183.smtp-out.amazonses.com [54.240.9.183]) by inbound-smtp.us-east-1.amazonaws.com with SMTP id d6iitobk75ur44p8kdnnp7g2n800 for recipient@example.com; Fri, 11 Sep 2015 20:32:33 +0000 (UTC)"
            },
            {
              "name": "DKIM-Signature",
              "value": "v=1; a=rsa-sha256; q=dns/txt; c=relaxed/simple; s=ug7nbtf4gccmlpwj322ax3p6ow6yfsug; d=amazonses.com; t=1442003552; h=From:To:Subject:MIME-Version:Content-Type:Content-Transfer-Encoding:Date:Message-ID:Feedback-ID; bh=DWr3IOmYWoXCA9ARqGC/UaODfghffiwFNRIb2Mckyt4=; b=p4ukUDSFqhqiub+zPR0DW1kp7oJZakrzupr6LBe6sUuvqpBkig56UzUwc29rFbJF hlX3Ov7DeYVNoN38stqwsF8ivcajXpQsXRC1cW9z8x875J041rClAjV7EGbLmudVpPX 4hHst1XPyX5wmgdHIhmUuh8oZKpVqGi6bHGzzf7g="
            },
            {
              "name": "From",
              "value": "sender@example.com"
            },
            {
              "name": "To",
              "value": "recipient@example.com"
            },
            {
              "name": "Subject",
              "value": "Example subject"
            },
            {
              "name": "MIME-Version",
              "value": "1.0"
            },
            {
              "name": "Content-Type",
              "value": "text/plain; charset=UTF-8"
            },
            {
              "name": "Content-Transfer-Encoding",
              "value": "7bit"
            },
            {
              "name": "Date",
              "value": "Fri, 11 Sep 2015 20:32:32 +0000"
            },
            {
              "name": "Message-ID",
              "value": "<61967230-7A45-4A9D-BEC9-87CBCF2211C9@example.com>"
            },
            {
              "name": "X-SES-Outgoing",
              "value": "2015.09.11-54.240.9.183"
            },
            {
              "name": "Feedback-ID",
              "value": "1.us-east-1.Krv2FKpFdWV+KUYw3Qd6wcpPJ4Sv/pOPpEPSHn2u2o4=:AmazonSES"
            }
          ],
          "commonHeaders": {
            "returnPath": "0000014fbe1c09cf-7cb9f704-7531-4e53-89a1-5fa9744f5eb6-000000@amazonses.com",
            "from": [
              "sender@example.com"
            ],
            "date": "Fri, 11 Sep 2015 20:32:32 +0000",
            "to": [
              "recipient@example.com"
            ],
            "messageId": "<61967230-7A45-4A9D-BEC9-87CBCF2211C9@example.com>",
            "subject": "Example subject"
          }
        }
      },
      "eventSource": "aws:ses"
    }
  ]
}
'
``````
Asegurate de que el JSON dentro del body tenga el mismo formato. Es un requisito.

Ejecuta el comando ya sea desde Postman o desde una terminal linux o windows.

# Reto 2 

Este reto se desarrollo creando unendpoint que admite dos formas de ejecucion:

## Carga un archivo .eml
Para este reto la manera para cargar archivos .eml (Archivo de E-mail) se realizara de la siguiente forma

``````
curl --location 'http://localhost:3000/upload' \
--header 'Content-type: application/json' \
--form 'file=@"/C:/Users/sagra/Downloads/Mi archivos json.eml"'
``````

Cambia `/C:/Users/sagra/Downloads/Mi archivos json.eml` por la ruta donde esta localizado tu archivo `.eml` de manera local

## Usa una URL web o un Path local para apuntar a tu archivo de email `.eml`

````
curl --location --request POST 'http://localhost:3000/upload?url=https%3A%2F%2Ftest-backups-memgraph.s3.amazonaws.com%2FMi%2Barchivos%2Bjson.eml' \
--header 'Content-type: application/json'
````

Puedes cambiar la direccion `https%3A%2F%2Ftest-backups-memgraph.s3.amazonaws.com%2FMi%2Barchivos%2Bjson.eml` por la direccion URL o PATH que deses

Ejecuta el comando ya sea desde Postman o desde una terminal linux o windows.
