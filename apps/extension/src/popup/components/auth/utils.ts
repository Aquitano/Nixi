import { createStore } from 'solid-js/store';
import { lazily } from 'solidjs-lazily';
import {
  doesEmailExist,
  emailPasswordSignIn,
  emailPasswordSignUp,
} from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import { z } from 'zod';
import { setIsLoggedIn } from '../../App.jsx';
import { ColorClasses, addMessage } from '../../utils.js';

const Session = lazily(() => import('supertokens-web-js/recipe/session'));

const FormDataSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type FormData = z.infer<typeof FormDataSchema>;
export type AuthState = 'signIn' | 'signUp';

/**
 * Type guard function to check if an error is a SuperTokens error.
 *
 * @param {unknown} err - The error to check.
 * @returns {boolean} Returns true if the error is a SuperTokens error, false otherwise.
 */
function isSuperTokensError(
  err: unknown,
): err is { isSuperTokensGeneralError: true; message: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'isSuperTokensGeneralError' in err &&
    err.isSuperTokensGeneralError === true
  );
}

/**
 * Check if a user with the given email address already exists
 *
 * @param {string} email - Email address of user
 */
async function checkEmail(email: string) {
  try {
    // Call the doesEmailExist function to check if the email already exists
    const response = await doesEmailExist({ email });
    if (response.doesExist) {
      // If the email already exists, display an error message
      addMessage('Email already exists. Please sign in instead', ColorClasses.error);
    }
  } catch (err: unknown) {
    if (isSuperTokensError(err)) {
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
  await Session.signOut();

  // Clear cookies and local storage
  localStorage.removeItem('st-cookie');
  localStorage.removeItem('supertokens');

  // Check if the user is still logged in
  if (await Session.doesSessionExist()) {
    const response = await fetch('http://localhost:8200/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());

    // console.log(response);

    if (response.message === 'unauthorised') {
      setIsLoggedIn(false);
      window.location.href = '/index.html';
      return;
    }

    addMessage('Logout failed - please reload page', ColorClasses.error);
  } else {
    setIsLoggedIn(false);

    // Redirect the user to the homepage
    window.location.href = '/index.html';
  }
}

/**
 * Sign up a new user
 *
 * @param {String} email - Email address of user
 * @param {String} password - Password of user
 */
export async function signUpClicked(email: string, password: string) {
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
    } else if (response.status === undefined) {
      addMessage('Oops! Something went wrong.', ColorClasses.error);
    } else {
      // Sign up successful.
      window.location.href = '/index.html';
    }
  } catch (err: unknown) {
    if (isSuperTokensError(err)) {
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
 * @param {String} email - Email address of user
 * @param {String} password - Password of user
 */
export async function signInClicked(email: string, password: string) {
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

    console.log(`Status:${response.status}`);

    if (response.status === 'FIELD_ERROR') {
      response.formFields.forEach((formField) => {
        if (formField.id === 'email') {
          // Email validation failed
          addMessage(formField.error, ColorClasses.error);
        }
      });
    } else if (response.status === 'WRONG_CREDENTIALS_ERROR') {
      addMessage('Email password combination is incorrect.', ColorClasses.error);
    } else if (response.status === undefined) {
      addMessage('Oops! Something went wrong.', ColorClasses.error);
    } else {
      console.log('Login successful');
      await Session.attemptRefreshingSession();
      setIsLoggedIn(true);
    }
  } catch (err: unknown) {
    if (isSuperTokensError(err)) {
      // Custom error message sent from the API
      addMessage(err.message, ColorClasses.error);
    } else {
      addMessage('Oops! Something went wrong.', ColorClasses.error);
    }
  }
}

/**
 * Submit login form (data is validated before submission)
 * @param form - Form data
 * @param authState - Current auth state
 */
const submit = async (form: FormData, authState: AuthState) => {
  const validation = FormDataSchema.safeParse(form);
  if (!validation.success) {
    // handle validation error
    addMessage('Zod Validation Error!', ColorClasses.error);
    return;
  }
  const { doesSessionExist } = await import('supertokens-web-js/recipe/session');

  if (authState === 'signIn') {
    await signInClicked(form.email, form.password);

    console.log('doesSessionExist', await doesSessionExist());
  } else if (authState === 'signUp') {
    await signUpClicked(form.email, form.password);

    console.log('doesSessionExist', await doesSessionExist());
  }
};

export const useForm = () => {
  const [form, setForm] = createStore<FormData>({
    email: '',
    password: '',
  });

  const clearField = (fieldName: string) => {
    setForm({
      [fieldName]: '',
    });
  };

  const updateFormField = (fieldName: string) => (event: Event) => {
    const inputElement = event.currentTarget as HTMLInputElement;
    setForm({
      [fieldName]: inputElement.value,
    });
  };

  return { form, submit, updateFormField, clearField };
};
