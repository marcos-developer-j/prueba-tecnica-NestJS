# Prueba Tecnica NestJS

https://test-backups-memgraph.s3.amazonaws.com/Mi+archivos+json.eml

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
curl --location 'http://localhost:3000/upload' \
--header 'Content-type: application/json' \
--form 'file=@"/C:/Users/sagra/Downloads/ses-sns-event.json"'
``````
Cambia `/C:/Users/sagra/Downloads/ses-sns-event.json` por la ruta donde esta localizado tu archivo `.json`

Ejecuta el comando ya sea desde Postman o desde una terminal linux o windows.

# Reto 2 
Para este reto la manera para cargar archivos .eml (Archivo de E-mail) se realizara de la siguiente forma

``````
curl --location 'http://localhost:3000/upload' \
--header 'Content-type: application/json' \
--form 'file=@"/C:/Users/sagra/Downloads/Mi archivos json.eml"'
``````

Cambia `/C:/Users/sagra/Downloads/Mi archivos json.eml` por la ruta donde esta localizado tu archivo `.eml`

Ejecuta el comando ya sea desde Postman o desde una terminal linux o windows.
