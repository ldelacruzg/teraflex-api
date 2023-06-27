import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecurityModule } from './security/security.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Teraflex API')
    .setDescription('Documentación de la API de Teraflex')
    .setVersion('1.0')
    // .addServer('http://localhost:3000/', 'localhost')
    // .addServer('http://localhost:3000/', 'servidor externo')
    .setExternalDoc('Módulo de seguridad', 'http://localhost:3000/api/security')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const securityOptions = new DocumentBuilder()
    .setTitle('Módulo de seguridad')
    .setDescription('Documentación de la API de Teraflex')
    .setVersion('1.0')
    // .addServer('http://localhost:3000/', 'localhost')
    .addBearerAuth()
    .build();

  const securityDocument = SwaggerModule.createDocument(app, securityOptions, {
    include: [SecurityModule],
  });
  SwaggerModule.setup('api/security', app, securityDocument);

  app.enableCors({
    origin: '*',
  });

  await app.listen(3000);
}

bootstrap();
