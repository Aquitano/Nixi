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
    const { setupSaveButton, saveButtonHTML } = await import('./button');
    const { axiosInstance } = await import('./utils');

    // Add the save button to the page
    document.querySelector<HTMLDivElement>('.card')!.innerHTML += saveButtonHTML;

    // Get the save button from the page
    const button = document.querySelector<HTMLButtonElement>('#save-button')!;

    // Make a request to the server to get the user's data
    console.log((await axiosInstance.get('http://localhost:8200/users/me')).data);
    document.querySelector('#app > div > div.card > div.auth');
    setupSaveButton(button);
  } else {
    const { initAuthForm } = await import('./userAuth');

    await initAuthForm();
  }
});
