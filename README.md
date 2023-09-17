# TeraFlex API
## Descripción

Este sistema web ha sido desarrollada como parte del proyecto de vinculación “Tecnologías de la Información y Comunicación enfocadas a la discapacidad en la zona de influencia de la UTEQ” (F&C), de la Carrera de Ingeniería en Sistemas/Software, perteneciente a la Facultad de Ciencias de la Ingeniería, de la Universidad Técnica Estatal de Quevedo, en cooperación con la Dirección de Gestión de Desarrollo Social del GAD de Quevedo. Con este proyecto, se pretende mejorar la atención de terapias de los pacientes de la ciudad de Quevedo.

## Instalación

```bash
$ yarn install
```

## Ejecución de la aplicación

```bash
# Docker
$ docker-compose up -d

# development
$ yarn run start

# watch mode
$ yarn run start:dev
$ yarn run dev

# production mode
$ yarn run start:prod

# build
$ yarn run build
```

## Variables de entorno

```dotenv
# Database
DATABASE_HOST
DATABASE_PORT
DATABASE_USERNAME
DATABASE_PASSWORD
DATABASE_NAME
DATABASE_SSL
DATABASE_SYNC

# JWT
JWT_SECRETKEY

# Firebase
FIREBASE_CONFIG

# Server
PORT
CORS

# Admin
ADMIN_USER
ADMIN_PASSWORD

#Files
PUBLIC_DIR
FILE_SIZE

#Swagger
SWAGGER_REQ
```

## Información adicional
Es necesario el archivo "firebase.json" para la conexión con Firebase Cloud Messaging. Es recomendable que éste archivo esté en la raíz del proyecto o debe especificar la ruta con la variable de entorno "FIREBASE_CONFIG".

Para las variables de entorno, se debe crear un archivo ".env" en la raíz del proyecto.






