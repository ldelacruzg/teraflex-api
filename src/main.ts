import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
// import compression from 'compression';
import helmet from 'helmet';
import { Environment } from '@shared/constants/environment';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Teraflex Server')
    .setDescription('Documentación de la API de Teraflex')
    .setExternalDoc(
      'Repositorio de github',
      'https://github.com/IvanM9/teraflex-api',
    )
    .setContact('FyC', 'https://fyc.uteq.edu.ec/', 'info@uteq.edu.ec')
    .addServer(Environment.SWAGGER_REQ)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: Environment.CORS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // app.use(
  //   compression({
  //     level: 9,
  //   }),
  // );

  app.use(helmet());

  // configurar carpeta de archivos estáticos
  app.useStaticAssets(join(__dirname, '..', Environment.PUBLIC_DIR), {
    prefix: '/uploads/',
    setHeaders: (res, path) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  });

  await app.listen(Environment.PORT);
}

bootstrap();
