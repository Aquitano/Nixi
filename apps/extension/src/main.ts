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

function signIn(e: SubmitEvent, signInClicked: (email: string, password: string) => Promise<void>) {
  e.preventDefault();

  const credentials = {
    email: document.querySelector<HTMLInputElement>('#email')!.value,
    password: document.querySelector<HTMLInputElement>('#password')!.value,
  };
  signInClicked(credentials.email, credentials.password);
}

// Is user logged in?
Session.doesSessionExist().then(async (exists) => {
  Session.attemptRefreshingSession();
  if (exists) {
    const { setupSaveButton, saveButtonHTML } = await import('./button');
    const { axiosInstance } = await import('./utils');

    document.querySelector<HTMLDivElement>('.card')!.innerHTML += saveButtonHTML;

    const button = document.querySelector<HTMLButtonElement>('#save-button')!;

    console.log((await axiosInstance.get('http://localhost:8200/users/me')).data);
    document.querySelector('#app > div > div.card > div.auth');
    setupSaveButton(button);
  } else {
    const { loginFormHTML, signInClicked, signUpClicked } = await import('./userAuth');

    const authContainer = document.querySelector<HTMLDivElement>('.auth')!;

    authContainer.innerHTML = loginFormHTML;

    const loginForm = document.querySelector<HTMLDivElement>('#loginForm')!;

    const switchButton = document.querySelector<HTMLButtonElement>('#switchButton')!;

    document
      .querySelector<HTMLButtonElement>('#signUpButton')!
      .addEventListener('click', async () => {
        switchButton.querySelector('span')!.textContent = 'Already have an account?';
        switchButton.querySelector('a')!.textContent = 'Sign Up';
        loginForm.querySelector('button')!.textContent = 'Sign Up';

        loginForm.removeEventListener('submit', (e) => {
          signIn(e, signInClicked);
        });

        loginForm.addEventListener('submit', (e) => {
          e.preventDefault();

          const credentials = {
            email: document.querySelector<HTMLInputElement>('#email')!.value,
            password: document.querySelector<HTMLInputElement>('#password')!.value,
          };
          signUpClicked(credentials.email, credentials.password);
        });
      });

    loginForm.addEventListener('submit', async (e) => {
      signIn(e, signInClicked);
    });
  }
});
