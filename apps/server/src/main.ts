import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import supertokens from 'supertokens-node';
import { AppModule } from './app.module';
import { SupertokensExceptionFilter } from './auth/auth.filter';
import * as SuperTokensConfig from './config';

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

  await app.listen(configService.get('APP_PORT'));
}

bootstrap();
