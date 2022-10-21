import SessionReact from 'supertokens-auth-react/recipe/session';
import ThirdPartyEmailPasswordReact, {
  Apple,
  Github,
  Google,
} from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import Session from 'supertokens-web-js/recipe/session';

export const SuperTokensReactConfig = {
  appInfo: {
    appName: 'SuperTokens Demo App',
    apiDomain: 'http://localhost:8200',
    websiteDomain: 'http://localhost:3000',
  },
  recipeList: [
    ThirdPartyEmailPasswordReact.init({
      useShadowDom: false,
      signInAndUpFeature: {
        providers: [Github.init(), Google.init(), Apple.init()],
      },
      // @ts-ignore
      emailVerificationFeature: {
        mode: 'REQUIRED',
      },
    }),
    SessionReact.init(),
  ],
};

export const SuperTokensWebJSConfig = {
  appInfo: {
    appName: 'SuperTokens Demo',
    apiDomain: 'http://localhost:8200',
  },
  recipeList: [Session.init()],
};
