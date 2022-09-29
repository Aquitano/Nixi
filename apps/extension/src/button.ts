import axios from 'axios';

function getData() {
  return {};
}

function saveToken(token: string) {
  chrome.storage.local.set({ jwt: token }, () => {
    console.log(`Value is set to ${token}`);
  });
}

export function setupSaveButton(element: HTMLButtonElement, jwt: string) {
  element.addEventListener('click', () => {
    axios({
      method: 'post',
      url: 'http://localhost:8200/articles',
      data: getData(),
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      responseType: 'json',
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        const errorHtml =
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          document.querySelector<HTMLDivElement>('#error')!;
        errorHtml.innerText = error;
        errorHtml.classList.add('fade-in');
        errorHtml.style.visibility = 'visible';
      });
  });
}

export function setupLoginButton(
  element: HTMLButtonElement,
  credentials: { email: string; password: string },
) {
  element.addEventListener('click', () => {
    axios
      .post('http://localhost:8200/auth/login', {
        ...credentials,
      })
      .then((response) => {
        // console.log(JSON.parse(response.request.response));

        // const errorHtml =
        //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        //   document.querySelector<HTMLDivElement>('#error')!;
        // errorHtml.innerText = response.request.response;
        // errorHtml.classList.add('fade-in');
        // errorHtml.style.visibility = 'visible';
        saveToken(JSON.parse(response.request.response).access_token);
        // refresh page
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        const errorHtml =
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          document.querySelector<HTMLDivElement>('#error')!;
        errorHtml.innerText = error;
        errorHtml.classList.add('fade-in');
        errorHtml.style.visibility = 'visible';
      });
  });
}
