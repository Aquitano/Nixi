/* eslint-disable no-console */
/* eslint-disable no-bitwise */
import { CreateArticleDto } from './dto';

function countWords(str: string) {
  const arr = str.split(' ');

  return arr.filter((word) => word !== '').length;
}

// Hash function
function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

async function getArticleData() {
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
    };
  }

  return data;
}

console.log('Nixi contentScript.js loaded');

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

export {};
