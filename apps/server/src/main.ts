import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import supertokens from 'supertokens-node';
import { AppModule } from './app.module';
import { SupertokensExceptionFilter } from './auth/auth.filter';
import { appInfo } from './config';

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
		origin: [appInfo.websiteDomain, 'chrome-extension://kkenfjmihclibmcapadmbdceojeoclok'],

		allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders(), 'st-cookie'],
		exposedHeaders: ['st-cookie'],
		credentials: true,
	});

	// Swagger
	const config = new DocumentBuilder()
		.setTitle('Nixi Server API')
		.setDescription('✨ Nixi is an open-source read-it-later and productivity app.')
		.setVersion('0.0.1')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(configService.get('APP_PORT'));
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
