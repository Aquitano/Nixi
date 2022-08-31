import axios from 'axios';

function getData() {
  return {};
}

export function setupButton(element: HTMLButtonElement) {
  element.addEventListener('click', () => {
    axios
      .post('http://localhost:8200/articles', {
        ...getData(),
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
