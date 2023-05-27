/* @refresh reload */
import { render } from 'solid-js/web';

import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword';

import App from './App.jsx';
import './index.css';

SuperTokens.init({
  appInfo: {
    apiDomain: 'http://localhost:8200',
    apiBasePath: '/auth',
    appName: '...',
  },
  recipeList: [
    Session.init({
      tokenTransferMethod: 'header',
    }),
    ThirdPartyEmailPassword.init(),
  ],
});

render(() => <App />, document.getElementById('root'));
