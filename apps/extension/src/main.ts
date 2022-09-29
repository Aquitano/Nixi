/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { setupLoginButton, setupSaveButton } from './button';
import './style.css';

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

// check if user is logged in
chrome.storage.local.get(['jwt'], (result) => {
  const button = document.querySelector<HTMLButtonElement>('#main-button')!;

  if (result.jwt && Date.now() <= parseJwt(result.jwt).exp * 1000) {
    button.innerText = 'Save Article';
    button.id = 'save-button';

    const inputs = document.querySelectorAll('.wrap-input');
    inputs.forEach((input) => {
      input.remove();
    });

    setupSaveButton(button, result.jwt);
  } else {
    button.innerText = 'Login';
    button.id = 'login-button';
    button.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'login' });
      const credentials = {
        email: document.querySelector<HTMLInputElement>('#email')!.value,
        password: document.querySelector<HTMLInputElement>('#password')!.value,
      };
      setupLoginButton(button, credentials);
    });
  }
});
