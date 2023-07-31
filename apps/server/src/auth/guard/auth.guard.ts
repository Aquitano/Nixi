import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Error as STError } from 'supertokens-node';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

@Injectable()
export class AuthGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const httpContext = context.switchToHttp();
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const response = httpContext.getResponse();

		// verify the session and handle any errors
		let err: any;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		await verifySession()(httpContext.getRequest(), response, (res) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			err = res;
		});

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (response.headersSent) {
			throw new STError({
				message: 'RESPONSE_SENT',
				type: 'RESPONSE_SENT',
			});
		}

		if (err) {
			throw err;
		}

		return true;
	}
}
