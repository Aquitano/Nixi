// import { Controller, Get, UseGuards } from '@nestjs/common';
// import { SessionContainer } from 'supertokens-node/recipe/session';
// import { AppService } from './app.service';
// import { AuthGuard } from './auth/auth.guard';
// import { Session } from './auth/session.decorator';

// @Controller()
// export class AppController {
//   constructor(private readonly appService: AppService) {}

//   @Get('/sessioninfo')
//   @UseGuards(AuthGuard)
//   getSessionInformation(@Session() session: SessionContainer): any {
//     return {
//       sessionHandle: session.getHandle(),
//       userId: session.getUserId(),
//       accessTokenPayload: session.getAccessTokenPayload(),
//     };
//   }
// }
export {};
