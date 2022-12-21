async function checkEmail(email: string) {
  // Dynamic import of doesEmailExist from supertokens-web-js
  const { doesEmailExist } = await import('supertokens-web-js/recipe/thirdpartyemailpassword');
  try {
    const response = await doesEmailExist({
      email,
    });

    if (response.doesExist) {
      window.alert('Email already exists. Please sign in instead');
    }
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      // this may be a custom error message sent from the API by you.
      window.alert(err.message);
    } else {
      window.alert('Oops! Something went wrong.');
    }
  }
}

export async function logout() {
  const Session = await import('supertokens-web-js/recipe/session');

  await Session.signOut();

  await localStorage.removeItem('st-cookie');
  await localStorage.removeItem('supertokens');

  Session.doesSessionExist().then((userId) => {
    console.log(userId);
  });
  window.location.href = '/index.html';
}

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
      // one of the input formFields failed validaiton
      response.formFields.forEach((formField) => {
        if (formField.id === 'email') {
          // Email validation failed (for example incorrect email syntax),
          // or the email is not unique.
          window.alert(formField.error);
        } else if (formField.id === 'password') {
          // Password validation failed.
          // Maybe it didn't match the password strength
          window.alert(formField.error);
        }
      });
    } else {
      // sign up successful. The session tokens are automatically handled by
      // the frontend SDK.
      window.location.href = '/index.html';
    }
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      // this may be a custom error message sent from the API by you.
      window.alert(err.message);
    } else {
      window.alert('Oops! Something went wrong.');
    }
  }
}

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
          // Email validation failed (for example incorrect email syntax).
          window.alert(formField.error);
        }
      });
    } else if (response.status === 'WRONG_CREDENTIALS_ERROR') {
      window.alert('Email password combination is incorrect.');
    } else {
      // sign in successful. The session tokens are automatically handled by
      // the frontend SDK.
      window.location.href = '/index.html';
    }
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      // this may be a custom error message sent from the API by you.
      window.alert(err.message);
    } else {
      window.alert('Oops! Something went wrong.');
    }
  }
}
