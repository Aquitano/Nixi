import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import * as SuperTokensConfig from './config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    ArticleModule,
    PrismaModule,
    AuthModule.forRoot({
      // try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
      connectionURI: SuperTokensConfig.connectionUri,
      // apiKey: "IF YOU HAVE AN API KEY FOR THE CORE, ADD IT HERE",
      appInfo: SuperTokensConfig.appInfo,
    }),
  ],
})
export class AppModule {}
