/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { addMessage, ColorClasses } from './utils';

const AuthState: { currentAuthState: 'login' | 'signup' } = {
  currentAuthState: 'login',
};

/**
 * Check if a user with the given email address already exists
 *
 * @param {string} email - Email address of user
 */
async function checkEmail(email: string) {
  // Dynamic import of doesEmailExist from supertokens-web-js
  const { doesEmailExist } = await import('supertokens-web-js/recipe/thirdpartyemailpassword');
  try {
    const response = await doesEmailExist({
      email,
    });

    if (response.doesExist) {
      addMessage('Email already exists. Please sign in instead', ColorClasses.error);
    }
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      // Custom error message sent from the API
      addMessage(err.message, ColorClasses.error);
    } else {
      addMessage('Oops! Something went wrong.', ColorClasses.error);
    }
  }
}

/**
 * Logout user by removing the session token from local storage and invoking the SuperTokens session logout function
 */
export async function logout() {
  const Session = await import('supertokens-web-js/recipe/session');

  await Session.signOut();

  localStorage.removeItem('st-cookie');
  localStorage.removeItem('supertokens');

  Session.doesSessionExist().then((userId) => {
    if (userId) {
      // User is still logged in
      addMessage('Logout failed', ColorClasses.error);
    }
  });

  window.location.href = '/index.html';
}

/**
 * Sign up a new user
 *
 * @param {SubmitEvent} e - Form submit event
 * @param {Object} credentials - Email and password of user
 */
export async function signUpClicked(
  e: SubmitEvent,
  credentials: { email?: string; password?: string } = {},
) {
  e.preventDefault();
  const { emailPasswordSignUp } = await import('supertokens-web-js/recipe/thirdpartyemailpassword');

  if (!credentials.email) {
    credentials.email = (document.getElementById('email') as HTMLInputElement).value;
  }
  if (!credentials.password) {
    credentials.password = (document.getElementById('password') as HTMLInputElement).value;
  }

  await checkEmail(credentials.email);

  try {
    const response = await emailPasswordSignUp({
      formFields: [
        {
          id: 'email',
          value: credentials.email,
        },
        {
          id: 'password',
          value: credentials.password,
        },
      ],
    });

    if (response.status === 'FIELD_ERROR') {
      // one of the input formFields failed validation
      response.formFields.forEach((formField) => {
        if (formField.id === 'email') {
          // Email validation failed, or the email is not unique.
          addMessage(formField.error, ColorClasses.error);
        } else if (formField.id === 'password') {
          // Password validation failed.
          // Maybe it didn't match the password strength
          addMessage(formField.error, ColorClasses.error);
        }
      });
    } else {
      // Sign up successful.
      window.location.href = '/index.html';
    }
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      // Custom error message sent from the API
      addMessage(err.message, ColorClasses.error);
    } else {
      addMessage('Oops! Something went wrong.', ColorClasses.error);
    }
  }
}

/**
 * Sign in a user
 *
 * @param {SubmitEvent} e - Form submit event
 * @param {Object} credentials - Email and password of user
 */
export async function signInClicked(
  e: SubmitEvent,
  credentials: { email?: string; password?: string } = {},
) {
  e.preventDefault();

  const { emailPasswordSignIn } = await import('supertokens-web-js/recipe/thirdpartyemailpassword');

  if (!credentials.email) {
    credentials.email = (document.getElementById('email') as HTMLInputElement).value;
  }
  if (!credentials.password) {
    credentials.password = (document.getElementById('password') as HTMLInputElement).value;
  }

  try {
    const response = await emailPasswordSignIn({
      formFields: [
        {
          id: 'email',
          value: credentials.email,
        },
        {
          id: 'password',
          value: credentials.password,
        },
      ],
    });

    if (response.status === 'FIELD_ERROR') {
      response.formFields.forEach((formField) => {
        if (formField.id === 'email') {
          // Email validation failed
          addMessage(formField.error, ColorClasses.error);
        }
      });
    } else if (response.status === 'WRONG_CREDENTIALS_ERROR') {
      addMessage('Email password combination is incorrect.', ColorClasses.error);
    } else {
      // Sign in successful
      window.location.href = '/index.html';
    }
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      // Custom error message sent from the API
      addMessage(err.message, ColorClasses.error);
    } else {
      addMessage('Oops! Something went wrong.', ColorClasses.error);
    }
  }
}

/**
 * Switch between login and sign up forms
 *
 */
export async function switchForms() {
  const authForm = document.querySelector<HTMLFormElement>('#auth-form')!;
  const switchContainer = document.querySelector<HTMLButtonElement>('#switch-auth-state')!;

  if (AuthState.currentAuthState === 'login') {
    AuthState.currentAuthState = 'signup';

    switchContainer.querySelector('span')!.textContent = 'Already have an account?';
    switchContainer.querySelector('a')!.textContent = 'Sign Up';
    authForm.querySelector('button')!.textContent = 'Sign Up';

    authForm.removeEventListener('submit', signInClicked);
    authForm.addEventListener('submit', signUpClicked);
  } else {
    AuthState.currentAuthState = 'login';

    switchContainer.querySelector('span')!.textContent = "Don't have an account?";
    switchContainer.querySelector('a')!.textContent = 'Sign In';
    authForm.querySelector('button')!.textContent = 'Sign In';

    authForm.removeEventListener('submit', signUpClicked);
    authForm.addEventListener('submit', signInClicked);
  }
}

/**
 * Initialize the auth form and add event listeners
 *
 */
export async function initAuthForm() {
  const { loginFormHTML } = await import('./components');

  const authContainer = document.querySelector<HTMLDivElement>('.auth')!;

  authContainer.innerHTML = loginFormHTML;

  const authForm = document.querySelector<HTMLFormElement>('#auth-form')!;
  authForm.addEventListener('submit', signInClicked);

  const switchContainer = document.querySelector<HTMLButtonElement>('#switch-auth-state')!;
  switchContainer.querySelector('a')!.addEventListener('click', switchForms);
}
