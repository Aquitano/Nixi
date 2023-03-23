/* eslint-disable no-console */
import { CreateArticleDto } from '../assets/dto/create-article.dto';
import { countWords, hashString } from './utils';

/**
 * Get the article data from the current page
 *
 * @returns {Promise<CreateArticleDto | undefined>} The article data
 */
async function getArticleData(): Promise<CreateArticleDto | undefined> {
  let data: CreateArticleDto | undefined;

  // Get only the domain name
  const domainId = hashString(window.location.hostname);

  if (domainId === -1671552769) {
    const title = document.querySelector('#__next > main > article > header > h1')?.textContent;

    const author = document.querySelector(
      '#__next > main > article > header > div.a1ryita6 > div.a5fas5x > span',
    )?.textContent;

    const link = document.querySelector<HTMLAnchorElement>(
      '#reader\\.external-link\\.view-original',
    )?.href;

    const content = document.querySelector('#__next > main > article > article')?.innerHTML;

    let favorite = false;
    if (document.querySelector('[aria-label="Favorite Article"]') === null) {
      favorite = true;
    }

    data = {
      title,
      author,
      content,
      link,
      favorite,
      word_count: countWords(content),
    } satisfies CreateArticleDto;
  }

  return data;
}

/**
 * Initialize the content script
 *
 * @returns {void}
 */
function init(): void {
  chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
    if (request.task === 'getArticleData') {
      const data = await getArticleData();
      console.log(data);

      // Check if data is valid/not empty
      if (data) {
        sendResponse({ message: 'success', data });
      } else {
        sendResponse({ message: 'error', data: null });
      }
    }
  });

  console.log('Nixi contentScript.js loaded');
}

init();

export {};
