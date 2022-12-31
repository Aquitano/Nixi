import { CreateArticleDto } from './dto';
import { addMessage, axiosInstance, ColorClasses } from './utils';

export const saveButtonHTML = `
<button id="save-button" type="button" class="rounded-2xl bg-emerald-500 hover:bg-green-500 transition ease-in-out duration-500">Save Article</button>
` as const;

/**
 * Send article data to backend
 *
 * @param {CreateArticleDto} data - Full article data
 */
async function sendArticle(data: CreateArticleDto) {
  const articleId = await axiosInstance({
    method: 'post',
    url: 'http://localhost:8200/articles',
    data,
  })
    .then((response) => {
      addMessage(`${response.statusText} with id ${response.data.id}`, ColorClasses.success);
      return response.data.id;
    })
    .catch((error) => {
      addMessage(error, ColorClasses.error);
      return null;
    });

  await axiosInstance({ method: 'get', url: `http://localhost:8200/articles/tags/${articleId}` })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      addMessage(error, ColorClasses.error);
    });
}

/**
 * Get article data from current page
 */
async function getData() {
  // Get current tab
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
        if (response?.message === 'success') {
          const { data } = response;

          sendArticle(data);
        } else {
          addMessage('Error getting data from website', ColorClasses.error);
        }
      });
    } catch (error) {
      addMessage('Error getting data from website', ColorClasses.error);
    }
  }
}

/**
 * Setup save button to get data from current page and send it to backend
 *
 * @param {HTMLButtonElement} element - Save button
 */
export function setupSaveButton(element: HTMLButtonElement) {
  element.addEventListener('click', () => {
    getData();
  });
}
