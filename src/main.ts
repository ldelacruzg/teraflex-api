import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
// import compression from 'compression';
import helmet from 'helmet';
import { Environment } from '@shared/constants/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Teraflex Server')
    .setDescription('Documentación de la API de Teraflex')
    .setExternalDoc(
      'Repositorio de github',
      'https://github.com/IvanM9/teraflex-api',
    )
    .setContact('FyC', 'https://fyc.uteq.edu.ec/', 'info@uteq.edu.ec')
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

  await app.listen(Environment.PORT);
}

bootstrap();
