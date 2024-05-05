# TeraFlex API

## Configuración de variables de entorno

1. Copiar y pegar el archivo **.env.template** y cambiar el nombre a **.env**
2. Cambiar los valores de las variables de entorno. Ejemplo:

```
# Configuración de la base de datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=teraflex
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_SYNC=true
DATABASE_SSL=false

# Configuración de JWT
JWT_SECRETKEY=teraflex@jwt

# Puerto de la aplicación (opcional)
PORT=3000

# Nombre de la carpeta donde se guardan los videos
PUBLIC_DIR=uploads

# URL exacta donde se ejecuta el servidor (HOSTNAME)
HOSTNAME=http://teraflex-api:3000

# Configuración de gamificación
AMOUNT_FLEXICOINS_PER_TASK_PERFORMED=10
AMOUNT_EXPERIENCE_PER_TASK_PERFORMED=15
ACCURANCY_RANK_DOWN=0.3
ACCURANCY_RANK_SAME=0.7
STORE_FREE_APPOINTMENT_FXC=100
```

Tener en cuenta que en la variable de HOSTNAME apunta a un contendor de Docker.

## Ejecución de la aplicación con Docker

1. Abrir una terminal y ubicarse en la carpeta raíz del proyecto
2. Ejecutar el siguiente comando:

```bash
$ docker compose -f ./docker-compose.dev.yml up
```

### Ejecución por primera vez

Si es la primera vez que ejecuta el proyecto deberá activar la variable de entorno **DATABASE_SYNC=true** que se encuentra en el archivo **.env**, luego podrá desactivarla, este paso permitirá crear la base de datos con un usuario por defecto.

- **Usuario**: 1234567890
- **Contraseña**: 12345

### Ejecución con la extensión VS Code "Dev Containers: Attach to Running Container..."

Si usted trabaja con Visual Studio Code podrá abrir una ventana con el contenedor del proyecto que este ejecutandose, para ello deberá seguir los siguiente pasos:

1. Presionar **Ctrl + Shift + P**
2. Escribir o buscar la opción **Dev Containers: Attach to Running Container...** y presionar **Enter**
3. Seleccionar el servicio "teraflex-api"

### Ejecución con la extensión VS Code "Dev Containers: Reopen in Container..."

En caso de que aún no este corriendo los servicios, podrá realizar todo los pasos anteriores desde el comando "docker compose" con una sola opción, para ello debera seguir los siguiente pasos:

1. Presionar **Ctrl + Shift + P**
2. Escribir o buscar la opción **Dev Containers: Reopen in Container...**

### Información adicional

Es necesario el archivo "firebase.json" para la conexión con Firebase Cloud Messaging. Es recomendable que éste archivo esté en la raíz del proyecto.
