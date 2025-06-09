import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomLoggerService } from './core/logger/custom-logger.service';
import { GlobalExceptionFilter } from './core/filters/gloabl-exception.filter';
import { useContainer } from 'class-validator';
import { VERSION_METADATA } from '@nestjs/common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_METADATA,
  });
  const logger = app.get(CustomLoggerService);
  logger.setContext('Bootstrap');
  const config = new DocumentBuilder().setTitle('Membership API').build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(process.env.PORT ?? 3099);

  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
