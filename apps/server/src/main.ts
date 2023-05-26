import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import supertokens from 'supertokens-node';
import { AppModule } from './app.module';
import { SupertokensExceptionFilter } from './auth/auth.filter';
import SuperTokensConfig from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(helmet());

  app.useGlobalFilters(new SupertokensExceptionFilter());

  app.enableCors({
    origin: [
      SuperTokensConfig.appInfo.websiteDomain,
      'chrome-extension://kkenfjmihclibmcapadmbdceojeoclok',
    ],

    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders(), 'st-cookie'],
    exposedHeaders: ['st-cookie'],
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('APP_PORT'));
}

bootstrap();
