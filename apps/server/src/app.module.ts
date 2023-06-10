import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { appInfo, connectionUri } from './config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		UserModule,
		ArticleModule,
		PrismaModule,
		AuthModule.forRoot({
			connectionURI: connectionUri,
			appInfo,
		}),
	],
})
export class AppModule {}
