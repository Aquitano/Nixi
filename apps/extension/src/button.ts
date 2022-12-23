import { CreateArticleDto } from './dto';
import { axiosInstance } from './utils';

// Add message to popup
function addMessage(message: string, colorClass: string) {
  const statusDiv = document.querySelector<HTMLDivElement>('.status');

  // Check if status already exists
  if (statusDiv?.firstChild) {
    statusDiv.removeChild(statusDiv.firstChild);
  }

  // Create response message
  const responseMessage = document.createElement('p');
  responseMessage.classList.add(colorClass, 'mb-5', 'fade-in');
  responseMessage.innerText = message;
  statusDiv.appendChild(responseMessage);
}

// Send data to backend
async function sendArticle(data: CreateArticleDto) {
  axiosInstance({
    method: 'post',
    url: 'http://localhost:8200/articles',
    data,
  })
    .then((response) => {
      addMessage(`${response.statusText} with id ${response.data.id}`, 'text-green-400');
    })
    .catch((error) => {
      addMessage(error, 'text-red-400');
    });
}

// Get article data from current page
async function getData() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url?.includes('chrome://') && tab.id !== undefined) {
    // Get data from website
    await chrome.scripting.executeScript({
      target: {
        tabId: tab.id,
      },
      files: ['contentScript.js'],
    });

    // Try to get data from website
    try {
      chrome.tabs.sendMessage(tab.id, { task: 'getArticleData' }, (response) => {
        // console.log({ response });
        if (response?.message === 'success') {
          const { data } = response;

          sendArticle(data);
        } else {
          addMessage('Error getting data from website', 'text-red-400');
        }
      });
    } catch (error) {
      addMessage('Error getting data from website', 'text-red-400');
    }
  }
}

export function setupSaveButton(element: HTMLButtonElement) {
  element.addEventListener('click', () => {
    getData();
  });
}
