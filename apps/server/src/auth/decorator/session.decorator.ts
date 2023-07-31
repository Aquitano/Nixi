import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Session = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const request = ctx.switchToHttp().getRequest();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
	return request.session;
});
