# TeraFlex API
## Descripción

Este sistema web ha sido desarrollada como parte del proyecto de vinculación “Tecnologías de la Información y Comunicación enfocadas a la discapacidad en la zona de influencia de la UTEQ” (F&C), de la Carrera de Ingeniería en Sistemas/Software, perteneciente a la Facultad de Ciencias de la Ingeniería, de la Universidad Técnica Estatal de Quevedo, en cooperación con la Dirección de Gestión de Desarrollo Social del GAD de Quevedo. Con este proyecto, se pretende mejorar la atención de terapias de los pacientes de la ciudad de Quevedo.

## Ejecución de la aplicación con Docker

```bash
$ docker compose -f ./docker-compose.dev.yml up
```
### Ejecución por primera vez

Si es la primera vez que ejecuta el proyecto deberá activar la variable de entorno **DATABASE_SYNC=true** que se encuentra en el archivo **.env**, luego podrá desactivarla, este paso permitirá crear la base de datos con un usuario por defecto.

* **Usuario**: 1234567890
* **Contraseña**: 12345

### Ejecución con la extensión VS Code "Dev Containers: Attach to Running Container..."

Si usted trabaja con visual studio code podrá abrir una ventana con el contenedor del proyecto que este ejecutandose, para ello deberá seguir los siguiente pasos:

* Presionar **Ctrl + Shift + P**
* Escribir o buscar la opción **Dev Containers: Attach to Running Container...** y presionar **Enter**
* Seleccionar el servicio "teraflex-api"

### Ejecución con la extensión VS Code "Dev Containers: Reopen in Container..."

En caso de que aún no este corriendo los servicios, podrá realizar todo los pasos anteriores desde el comando "docker compose" con una sola opción, para ello debera seguir los siguiente pasos:

* Presionar **Ctrl + Shift + P**
* Escribir o buscar la opción **Dev Containers: Reopen in Container...**

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
```

### Información adicional
Es necesario el archivo "firebase.json" para la conexión con Firebase Cloud Messaging. Es recomendable que éste archivo esté en la raíz del proyecto o debe especificar la ruta con la variable de entorno "FIREBASE_CONFIG".

Para las variables de entorno, se debe crear un archivo ".env" en la raíz del proyecto.