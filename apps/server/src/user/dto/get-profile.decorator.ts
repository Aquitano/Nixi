import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SessionContainer } from 'supertokens-node/recipe/session';

const prisma = new PrismaClient();

export const GetProfile = createParamDecorator(
  async (data: string | undefined, ctx: ExecutionContext) => {
    const { session }: { session: SessionContainer } = ctx.switchToHttp().getRequest();

    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.getUserId(),
      },
    });

    if (data) {
      return profile[data];
    }

    return profile;
  },
);
