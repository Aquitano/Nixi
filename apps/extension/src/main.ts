/* eslint-disable @typescript-eslint/no-non-null-assertion */
import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword';

import { setupSaveButton } from './button';
import './style.css';
import { logout, signInClicked } from './userAuth';

SuperTokens.init({
  appInfo: {
    apiDomain: 'http://localhost:8200',
    apiBasePath: '/auth',
    appName: '...',
  },
  recipeList: [Session.init(), ThirdPartyEmailPassword.init()],
});

const button = document.querySelector<HTMLButtonElement>('#main-button')!;
const logoutButton = document.querySelector<HTMLButtonElement>('#logout-button')!;

// Currently not working
logoutButton.addEventListener('click', async () => {
  logout();
});

Session.doesSessionExist().then(async (userId) => {
  if (userId === null) {
    window.alert('Please sign in');
    button.innerText = 'Login';
    button.id = 'login-button';
    button.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'login' });
      const credentials = {
        email: document.querySelector<HTMLInputElement>('#email')!.value,
        password: document.querySelector<HTMLInputElement>('#password')!.value,
      };
      signInClicked(credentials.email, credentials.password);
    });
  } else {
    window.alert(`Welcome ${await Session.getUserId()}`);

    button.innerText = 'Save Article';
    button.id = 'save-button';

    const inputs = document.querySelectorAll('.wrap-input');
    inputs.forEach((input) => {
      input.remove();
    });

    setupSaveButton(button, await Session.getAccessTokenPayloadSecurely());
  }
});
