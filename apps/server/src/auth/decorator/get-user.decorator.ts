import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionContainer } from 'supertokens-node/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';

export const GetUser = createParamDecorator(
  async (data: string | undefined, ctx: ExecutionContext) => {
    const { session }: { session: SessionContainer } = ctx.switchToHttp().getRequest();

    const userInfo = await ThirdPartyEmailPassword.getUserById(session.getUserId());

    if (data) {
      return userInfo[data];
    }

    return userInfo;
  },
);
