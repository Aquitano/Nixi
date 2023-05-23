import { PrismaClient } from '@prisma/client';
import Session from 'supertokens-node/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';

const { env } = process;

const prisma = new PrismaClient();

export const appInfo = {
  appName: 'Nixi',
  apiDomain: process.env.BACKEND_DOMAIN,
  websiteDomain: process.env.FRONTEND_DOMAIN,
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
};

export const connectionUri = process.env.SUPERTOKENS_DOMAIN;

// function to create a profile for a new user
async function createProfileForNewUser(response) {
  if (response.status === 'OK') {
    const { id: userId } = response.user;

    await prisma.profile.create({
      data: {
        userId,
      },
    });
  }

  return response;
}

export const recipeList = [
  ThirdPartyEmailPassword.init({
    providers: [
      ThirdPartyEmailPassword.Google({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }),
      ThirdPartyEmailPassword.Github({
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      }),
      ThirdPartyEmailPassword.Apple({
        clientId: env.APPLE_CLIENT_ID,
        clientSecret: {
          keyId: env.APPLE_KEY_ID,
          privateKey: env.APPLE_PRIVATE_KEY,
          teamId: env.APPLE_TEAM_ID,
        },
      }),
    ],
    override: {
      apis: (originalImplementation) => {
        return {
          ...originalImplementation,

          // override the email password sign up API
          async emailPasswordSignUpPOST(input) {
            if (originalImplementation.emailPasswordSignUpPOST === undefined) {
              throw Error('Should never come here');
            }

            const response = await originalImplementation.emailPasswordSignUpPOST(input);

            return createProfileForNewUser(response);
          },

          // override the thirdparty sign in / up API
          async thirdPartySignInUpPOST(input) {
            if (originalImplementation.thirdPartySignInUpPOST === undefined) {
              throw Error('Should never come here');
            }

            const response = await originalImplementation.thirdPartySignInUpPOST(input);

            if (response.status === 'OK' && response.createdNewUser) {
              return createProfileForNewUser(response);
            }

            return response;
          },
        };
      },
    },
  }),
  Session.init({
    getTokenTransferMethod: () => 'header',
  }),
];
