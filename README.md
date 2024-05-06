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

## Levantar base de datos con Docker

1. Abrir una terminal y ubicarse en la carpeta raíz del proyecto
2. Ejecutar el siguiente comando:

```bash
docker compose -f docker-compose.dev.yml up -d
```

## Ejecución del Servicio Web

1. Abrir una terminal y ubicarse en la carpeta raíz del proyecto
2. Instalar dependencias

```bash
npm install
```

3. Ejecutar cualquiera de los siguientes comandos:

```bash
yarn start:dev
```

```bash
npm run start:dev
```

Una vez el servicio web este en ejecución podrá hacer peticiones en [TeraFlex API](http://localhost:3000/api). Es recomendable que utilice una herramienta como cliente, por ejemplo: Postman, Insomnia, entre otras.

### Ejecución por primera vez

Si es la primera vez que ejecuta el proyecto deberá activar la variable de entorno **DATABASE_SYNC=true** que se encuentra en el archivo **.env**, luego podrá desactivarla, este paso permitirá crear la base de datos con un usuario por defecto (administrador).

- **Usuario**: 1234567890
- **Contraseña**: 12345

### Información adicional

Es necesario el archivo **firebase.json** para la conexión con Firebase Cloud Messaging. Es recomendable que dicho archivo esté en la raíz del proyecto.
