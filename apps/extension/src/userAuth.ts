import { addMessage, ColorClasses } from './utils';

export const loginFormHTML = `
<div class="auth">
      <div class="flex flex-col items-center justify-center">
        <h1 class="text-lg text-white font-bold">Sign in</h1>
        <p class="text-slate-200" id="switchButton">
          <span>Not registered yet?</span>
          <a class="text-indigo-500 hover:text-indigo-800 duration-300 transition-all" id="signUpButton"
            >Sign up</a
          >
        </p>
      </div>
      <div class="oAuth flex items-center justify-center gap-4 max-w-md mx-auto mt-2">
        <!-- GitHub -->
        <button
          class="bg-black hover:bg-gray-800 transition-all duration-300 py-2 px-4 rounded-xl flex items-center justify-center"
        >
          <div class="providerButton">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="17.556"
              viewBox="0 0 18 17.556"
            >
              <path
                fill="#fff"
                fill-rule="evenodd"
                d="M145.319 107.44a9 9 0 0 0-2.844 17.54c.45.082.614-.2.614-.434 0-.214-.008-.78-.012-1.531-2.5.544-3.032-1.206-3.032-1.206a2.384 2.384 0 0 0-1-1.317c-.817-.559.062-.547.062-.547a1.89 1.89 0 0 1 1.378.927 1.916 1.916 0 0 0 2.619.748 1.924 1.924 0 0 1 .571-1.2c-2-.227-4.1-1-4.1-4.448a3.479 3.479 0 0 1 .927-2.415 3.233 3.233 0 0 1 .088-2.382s.755-.242 2.475.923a8.535 8.535 0 0 1 4.506 0c1.718-1.165 2.472-.923 2.472-.923a3.234 3.234 0 0 1 .09 2.382 3.473 3.473 0 0 1 .925 2.415c0 3.458-2.1 4.218-4.11 4.441a2.149 2.149 0 0 1 .611 1.667c0 1.2-.011 2.174-.011 2.469 0 .24.162.52.619.433a9 9 0 0 0-2.851-17.539z"
                transform="translate(-136.32 -107.44)"
              ></path>
            </svg>
          </div>
          <div class="border-l border-gray-300 h-4 mx-3"></div>
          <div class="text-white">GitHub</div>
        </button>
        <!-- Google -->
        <button
          class="bg-red-500 hover:bg-red-600 transition-all duration-300 py-2 px-4 rounded-xl flex items-center justify-center"
        >
          <div class="providerButton">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18.001"
              height="18"
              viewBox="0 0 18.001 18"
            >
              <g id="Group_9292" transform="translate(-534 -389)">
                <path
                  id="Path_85803"
                  d="M3.989 144.285l-.627 2.339-2.29.048a9.016 9.016 0 0 1-.066-8.4l2.039.374.893 2.027a5.371 5.371 0 0 0 .05 3.616z"
                  transform="translate(534 255.593)"
                  style="fill: rgb(255, 255, 255)"
                ></path>
                <path
                  id="Path_85804"
                  d="M270.273 208.176a9 9 0 0 1-3.208 8.7l-2.568-.131-.363-2.269a5.364 5.364 0 0 0 2.308-2.739h-4.813v-3.56h8.645z"
                  transform="translate(281.57 188.143)"
                  style="fill: rgb(255, 255, 255)"
                ></path>
                <path
                  id="Path_85805"
                  d="M44.07 314.549a9 9 0 0 1-13.561-2.749l2.917-2.387a5.353 5.353 0 0 0 7.713 2.741z"
                  transform="translate(504.564 90.469)"
                  style="fill: rgb(255, 255, 255)"
                ></path>
                <path
                  id="Path_85806"
                  d="M42.362 2.072l-2.915 2.387a5.352 5.352 0 0 0-7.89 2.8l-2.932-2.4a9 9 0 0 1 13.737-2.787z"
                  transform="translate(506.383 389)"
                  style="fill: rgb(255, 255, 255)"
                ></path>
              </g>
            </svg>
          </div>
          <div class="border-l border-gray-300 h-4 mx-3"></div>
          <div class="text-white">Google</div>
        </button>
      </div>
      <div class="divider flex items-center justify-center py-2">
        <div class="border-t border-gray-300 w-1/3"></div>
        <div class="text-gray-200 mx-4">OR</div>
        <div class="border-t border-gray-300 w-1/3"></div>
      </div>
      <div class="EmailPassword">
        <form class="max-w-md mx-auto" id="loginForm">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email address"
                class="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div class="flex flex-col">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                class="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div class="flex flex-col">
              <button
                class="bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 py-2 px-4 rounded-xl text-white"
              >
                Sign in
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
` as const;

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
