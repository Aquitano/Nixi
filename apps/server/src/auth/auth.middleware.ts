import { Injectable, NestMiddleware } from '@nestjs/common';
import { middleware } from 'supertokens-node/framework/express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	supertokensMiddleware: any;

	constructor() {
		this.supertokensMiddleware = middleware();
	}

	use(req: Request, res: any, next: () => void) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
		return this.supertokensMiddleware(req, res, next);
	}
}
