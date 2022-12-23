import { addMessage, ColorClasses } from './utils';

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
 * @param {string} email - Email address of user
 * @param {string} password - Password of user
 */
export async function signUpClicked(email: string, password: string) {
  const { emailPasswordSignUp } = await import('supertokens-web-js/recipe/thirdpartyemailpassword');

  await checkEmail(email);

  try {
    const response = await emailPasswordSignUp({
      formFields: [
        {
          id: 'email',
          value: email,
        },
        {
          id: 'password',
          value: password,
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
 * @param {string} email - Email address of user
 * @param {string} password - Password of user
 */
export async function signInClicked(email: string, password: string) {
  const { emailPasswordSignIn } = await import('supertokens-web-js/recipe/thirdpartyemailpassword');

  try {
    const response = await emailPasswordSignIn({
      formFields: [
        {
          id: 'email',
          value: email,
        },
        {
          id: 'password',
          value: password,
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
