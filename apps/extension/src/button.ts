import axios from 'axios';
import { CreateArticleDto } from './dto';

// Add message to popup
function addMessage(message: string, colorClass: string) {
  const statusDiv = document.querySelector<HTMLDivElement>('.status');

  // Create response message
  const responseMessage = document.createElement('p');
  responseMessage.classList.add(colorClass, 'mb-5', 'fade-in');
  responseMessage.innerText = message;
  statusDiv.appendChild(responseMessage);
}

// Send data to backend
function sendArticle(data: CreateArticleDto, jwt: string) {
  axios({
    method: 'post',
    url: 'http://localhost:8200/articles',
    data,
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
    .then((response) => {
      addMessage(`${response.statusText} with id ${response.data.id}`, 'text-green-400');
    })
    .catch((error) => {
      addMessage(error, 'text-red-400');
    });
}

// Get article data from current page
async function getData(jwt: string) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url?.includes('chrome://') && tab.id !== undefined) {
    // Get data from website
    await chrome.scripting.executeScript({
      target: {
        tabId: tab.id,
      },
      func: () => {
        function countWords(str) {
          const arr = str.split(' ');

          return arr.filter((word) => word !== '').length;
        }

        const title = document.querySelector('#__next > main > article > header > h1')?.textContent;

        const author = document.querySelector(
          '#__next > main > article > header > div.a1ryita6 > div.a5fas5x > span',
        )?.textContent;

        const link = document.querySelector<HTMLAnchorElement>(
          '#reader\\.external-link\\.view-original',
        )?.href;

        const content = document.querySelector('#RIL_less > div')?.innerHTML;

        let favorite = false;
        if (document.querySelector('[aria-label="Favorite Article"]') === null) {
          favorite = true;
        }

        const data: CreateArticleDto = {
          title,
          author,
          content,
          link,
          favorite,
          word_count: countWords(document.querySelector('#RIL_less > div')?.textContent),
        };

        // Send data to popup
        chrome.runtime.sendMessage({ type: 'data', data });
      },
    });

    // eslint-disable-next-line no-inner-declarations
    function handleMessage(message) {
      chrome.runtime.onMessage.removeListener(handleMessage);

      if (message.type === 'data') {
        const { data } = message;
        sendArticle(data, jwt);
      }
    }

    // Run when data is received
    chrome.runtime.onMessage.addListener(handleMessage);
  }

  return {};
}

export function setupSaveButton(element: HTMLButtonElement, jwt: string) {
  element.addEventListener('click', () => {
    getData(jwt);
  });
}
