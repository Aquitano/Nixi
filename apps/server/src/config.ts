import { PrismaClient } from '@prisma/client';
import Session from 'supertokens-node/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';

const { env } = process;

const prisma = new PrismaClient();

function updateHeadersForResponse(res: any) {
  // this is specific to express response
  if (!res.original.headersSent) {
    const cookies = res.original.getHeader('Set-Cookie');
    if (cookies) {
      // We need to copy the Set-Cookie header into another one, since Set-Cookie is not accessible on the frontend
      res.original.setHeader('st-cookie', cookies);
      res.original.removeHeader('Set-Cookie');
    }
  }
}

function updateHeadersInRequest(req: any) {
  // this is specific to express request
  const stCookies = req.original.headers['st-cookie'];
  // If it was defined, we should overwrite the original cookies header with it.
  // Since the format matches, SuperTokens can access and parse them.
  if (stCookies) {
    req.original.headers.cookie = req.original.headers['st-cookie'];
  }
}

export const appInfo = {
  // Learn more about this on https://supertokens.com/docs/thirdpartypasswordless/appinfo
  appName: 'Nixi',
  apiDomain: process.env.BACKEND_DOMAIN,
  websiteDomain: process.env.FRONTEND_DOMAIN,
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
};

export const connectionUri = process.env.SUPERTOKENS_DOMAIN;

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

            if (response.status === 'OK') {
              const userId = response.user.id;

              await prisma.profile.create({
                data: {
                  userId,
                },
              });
            }

            return response;
          },

          // override the thirdparty sign in / up API
          async thirdPartySignInUpPOST(input) {
            if (originalImplementation.thirdPartySignInUpPOST === undefined) {
              throw Error('Should never come here');
            }

            const response = await originalImplementation.thirdPartySignInUpPOST(input);

            if (response.status === 'OK') {
              if (response.createdNewUser) {
                const userId = response.user.id;

                await prisma.profile.create({
                  data: {
                    userId,
                  },
                });
              }
            }

            return response;
          },
        };
      },
    },
  }),
  Session.init({
    override: {
      functions: (origImpl) => {
        return {
          ...origImpl,
          async createNewSession(input) {
            // We start with calling the original implementation because it doesn't need a session
            const session = await origImpl.createNewSession(input);
            // We need to copy the Set-Cookies header into the custom header in the response.
            updateHeadersForResponse(input.res);

            if (session) {
              const origUpdate = session.mergeIntoAccessTokenPayload.bind(session);
              session.mergeIntoAccessTokenPayload = async (newAccessTokenPayload, userContext) => {
                await origUpdate(newAccessTokenPayload, userContext);
                updateHeadersForResponse(input.res);
              };
            }

            return session;
          },
          async refreshSession(input) {
            // Before calling the original implementation, we need to check the custom header.
            updateHeadersInRequest(input.req);
            const session = await origImpl.refreshSession(input);
            updateHeadersForResponse(input.res);
            if (session) {
              const origUpdate = session.mergeIntoAccessTokenPayload.bind(session);
              session.mergeIntoAccessTokenPayload = async (newAccessTokenPayload, userContext) => {
                await origUpdate(newAccessTokenPayload, userContext);
                updateHeadersForResponse(input.res);
              };
            }
            return session;
          },
          async getSession(input) {
            // Before calling the original implementation, we need to check the custom header.
            updateHeadersInRequest(input.req);
            // Calling the original implementation
            const res = await origImpl.getSession(input);
            // This method may change cookie values, so we need to copy the Set-Cookies header into the custom header in the response.
            updateHeadersForResponse(input.res);
            if (res) {
              const origUpdate = res.mergeIntoAccessTokenPayload.bind(res);
              res.mergeIntoAccessTokenPayload = async (newAccessTokenPayload, userContext) => {
                await origUpdate(newAccessTokenPayload, userContext);
                updateHeadersForResponse(input.res);
              };
            }
            return res;
          },
        };
      },
    },
  }),
];
