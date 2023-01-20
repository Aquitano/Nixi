/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { addMessage, ColorClasses } from './utils';

const AuthState: { currentAuthState: 'login' | 'signup' } = {
  currentAuthState: 'login', // The default state is login
};

/**
 * Check if a user with the given email address already exists
 *
 * @param {string} email - Email address of user
 */
async function checkEmail(email: string) {
  const { doesEmailExist } = await import('supertokens-web-js/recipe/thirdpartyemailpassword');

  try {
    // Call the doesEmailExist function to check if the email already exists
    const response = await doesEmailExist({ email });
    if (response.doesExist) {
      // If the email already exists, display an error message
      addMessage('Email already exists. Please sign in instead', ColorClasses.error);
    }
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      // If the error is a SuperTokens error, display the error message from the API
      addMessage(err.message, ColorClasses.error);
    } else {
      // If the error is not a SuperTokens error, display a generic error message
      addMessage('Oops! Something went wrong.', ColorClasses.error);
    }
  }
}

/**
 * Logout user by removing the session token from local storage and invoking the SuperTokens session logout function
 */
export async function logout() {
  // Sign out the user
  const Session = await import('supertokens-web-js/recipe/session');
  await Session.signOut();

  // Clear cookies and local storage
  localStorage.removeItem('st-cookie');
  localStorage.removeItem('supertokens');

  // Check if the user is still logged in
  Session.doesSessionExist().then((userId) => {
    if (userId) {
      // User is still logged in
      addMessage('Logout failed', ColorClasses.error);
    }
  });

  // Redirect the user to the homepage
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
  credentials?: { email?: string; password?: string },
) {
  e.preventDefault();
  const { emailPasswordSignUp } = await import('supertokens-web-js/recipe/thirdpartyemailpassword');

  // Get the email and password from the HTML fields if not provided
  credentials.email ||= (document.getElementById('email') as HTMLInputElement).value;
  credentials.password ||= (document.getElementById('password') as HTMLInputElement).value;

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

  // Get the email and password from the HTML fields if not provided
  credentials.email ||= (document.getElementById('email') as HTMLInputElement).value;
  credentials.password ||= (document.getElementById('password') as HTMLInputElement).value;

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
export async function switchForms(): Promise<void> {
  const authForm = document.querySelector<HTMLFormElement>('#auth-form')!;
  const switchContainer = document.querySelector<HTMLButtonElement>('#switch-auth-state')!;

  switch (AuthState.currentAuthState) {
    case 'login':
      AuthState.currentAuthState = 'signup';

      // Update the UI
      switchContainer.querySelector('span')!.textContent = 'Already have an account?';
      switchContainer.querySelector('a')!.textContent = 'Sign Up';
      authForm.querySelector('button')!.textContent = 'Sign Up';

      // Remove the sign in event listener and add the sign up event listener.
      authForm.removeEventListener('submit', signInClicked);
      authForm.addEventListener('submit', signUpClicked);
      break;
    case 'signup':
      AuthState.currentAuthState = 'login';

      // Update the UI
      switchContainer.querySelector('span')!.textContent = "Don't have an account?";
      switchContainer.querySelector('a')!.textContent = 'Sign In';
      authForm.querySelector('button')!.textContent = 'Sign In';

      // Remove the sign in event listener and add the sign up event listener.
      authForm.removeEventListener('submit', signUpClicked);
      authForm.addEventListener('submit', signInClicked);
      break;
    default:
      throw new Error('Invalid auth state');
  }
}

/**
 * Initialize the auth form and add event listeners
 *
 */
export async function initAuthForm() {
  const { loginFormHTML } = await import('./components');

  // Add the login form to the DOM
  const authContainer = document.querySelector<HTMLDivElement>('.auth')!;
  authContainer.innerHTML = loginFormHTML;

  // Add a listener to the login form to handle `submit` events
  const authForm = document.querySelector<HTMLFormElement>('#auth-form')!;
  authForm.addEventListener('submit', signInClicked);

  // Add a listener to the "switch auth state" link to handle `click` events
  const switchContainer = document.querySelector<HTMLButtonElement>('#switch-auth-state')!;
  const switchLink = switchContainer.querySelector('a')!;
  switchLink.addEventListener('click', switchForms);
}
