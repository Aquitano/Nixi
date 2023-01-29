/* @refresh reload */
import { render } from 'solid-js/web';

import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword';

import App from './App';
import './index.css';

SuperTokens.init({
  appInfo: {
    apiDomain: 'http://localhost:8200',
    apiBasePath: '/auth',
    appName: '...',
  },
  recipeList: [
    Session.init({
      override: {
        functions: (oI) => {
          return {
            ...oI,
            // this override is only required if you are using axios
            // addAxiosInterceptors(input) {
            //   addCustomInterceptorToAxios(input);
            //   return oI.addAxiosInterceptors(input);
            // },
            async signOut(input) {
              await oI.signOut(input);
              localStorage.removeItem('st-cookie');
            },
          };
        },
      },
    }),
    ThirdPartyEmailPassword.init(),
  ],
});

render(() => <App />, document.getElementById('root'));
