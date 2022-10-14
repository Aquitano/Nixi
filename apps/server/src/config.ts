/* eslint-disable no-param-reassign */
import { PrismaClient } from '@prisma/client';
import Session from 'supertokens-node/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';

export const appInfo = {
  // Learn more about this on https://supertokens.com/docs/thirdpartypasswordless/appinfo
  appName: 'Nixi',
  apiDomain: 'http://localhost:8200',
  websiteDomain: 'http://localhost:3000',
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
};

export const connectionUri = 'http://localhost:3567';

export const recipeList = [
  ThirdPartyEmailPassword.init({
    providers: [
      // We have provided you with development keys which you can use for testing.
      // IMPORTANT: Please replace them with your own OAuth keys for production use.
      ThirdPartyEmailPassword.Google({
        clientId: '1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com',
        clientSecret: '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',
      }),
      ThirdPartyEmailPassword.Github({
        clientSecret: 'e97051221f4b6426e8fe8d51486396703012f5bd',
        clientId: '467101b197249757c71f',
      }),
      ThirdPartyEmailPassword.Apple({
        clientId: '4398792-io.supertokens.example.service',
        clientSecret: {
          keyId: '7M48Y4RYDL',
          privateKey:
            '-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----',
          teamId: 'YWQCXGJRJL',
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

              const prisma = new PrismaClient();

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

                const prisma = new PrismaClient();

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
  Session.init(),
];
