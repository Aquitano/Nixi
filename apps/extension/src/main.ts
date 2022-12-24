/* eslint-disable @typescript-eslint/no-non-null-assertion */
import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import './style.css';
import {
  addCustomInterceptorsToGlobalFetch,
  addCustomInterceptorToAxios,
  createAxiosInstance,
} from './utils';

const button = document.querySelector<HTMLButtonElement>('#main-button')!;

addCustomInterceptorsToGlobalFetch();

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
            addAxiosInterceptors(input) {
              addCustomInterceptorToAxios(input);
              return oI.addAxiosInterceptors(input);
            },
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

createAxiosInstance();

// Currently not working
const logoutButton = document.querySelector<HTMLButtonElement>('#logout-button')!;
logoutButton.addEventListener('click', async () => {
  const { logout } = await import('./userAuth');
  logout();
});

// Is user logged in?
Session.doesSessionExist().then(async (exists) => {
  Session.attemptRefreshingSession();
  if (exists) {
    const { setupSaveButton } = await import('./button');
    const { axiosInstance } = await import('./utils');

    button.innerText = 'Save Article';
    button.id = 'save-button';

    const inputs = document.querySelectorAll('.wrap-input');
    inputs.forEach((input) => {
      input.remove();
    });

    console.log((await axiosInstance.get('http://localhost:8200/users/me')).data);

    setupSaveButton(button);
  } else {
    const { signInClicked } = await import('./userAuth');

    button.innerText = 'Login';
    button.id = 'login-button';

    button.addEventListener('click', () => {
      const credentials = {
        email: document.querySelector<HTMLInputElement>('#email')!.value,
        password: document.querySelector<HTMLInputElement>('#password')!.value,
      };
      signInClicked(credentials.email, credentials.password);
    });
  }
});
