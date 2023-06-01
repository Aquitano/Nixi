import { Component, onMount } from 'solid-js';
import { CreateArticleDto } from '../../assets/dto';
import logo from '../../assets/logo.svg';
import { ColorClasses, addMessage } from '../utils';
import styles from './Save.module.css';

import Tags from './Tags';

import { articleId, setArticleId } from '../App';
import { logout } from './auth/utils';

/**
 * Checks if the article already exists in the database
 *
 * @param {string} url
 * @returns {Promise<boolean>}
 */
async function articleAlreadyExists(url?: string): Promise<boolean> {
  if (!url) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    url = tab.url;
  }

  const result = await fetch(`http://localhost:8200/articles/url/${encodeURIComponent(url)}`);

  if (result.status === 200) {
    const data = await result.json();
    setArticleId(data.id);
  }

  return result.ok;
}

/**
 * Injects content script into the current tab
 *
 * @returns {Promise<void>}
 */
async function injectContentScript(): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url?.includes('chrome://') && tab.id !== undefined) {
    console.log(`Injecting content script - ${tab.id}`);
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['contentScript.js'],
    });
  } else {
    addMessage('Unable to select your current tab. Please try again.', ColorClasses.error);
  }
}

/**
 * Sends article data to the server
 *
 * @param {CreateArticleDto} data
 * @returns {Promise<void>}
 */
async function sendArticle(data: CreateArticleDto): Promise<void> {
  if (await articleAlreadyExists(data.link)) {
    addMessage(`Article already exists - ${articleId()}`, ColorClasses.error);
    const a = await fetch(`http://localhost:8200/articles/${articleId()}?format=markdown`);
    console.log(await a.json());
    return;
  }

  const result = await fetch('http://localhost:8200/articles', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const resultData = await result.json();

  if (result.ok) {
    addMessage(`Article saved successfully - ${resultData.id} `, ColorClasses.success);
    setArticleId(resultData.id);
  } else {
    addMessage(`Error saving article - ${resultData.message}`, ColorClasses.error);
  }
}

/**
 * Fetches data from the current tab and sends it to the server
 *
 * @returns {Promise<void>}
 */
async function fetchPage(): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    chrome.tabs.sendMessage(tab.id, { action: 'getArticleData' }, (response) => {
      if (response?.message === 'success') {
        const { data } = response as {
          data: CreateArticleDto;
        };
        sendArticle(data);
      } else {
        addMessage('Error getting data from website', ColorClasses.error);
      }
    });
  } catch (error) {
    addMessage('Error getting data from website', ColorClasses.error);
  }
}

const Save: Component = () => {
  onMount(async () => {
    await articleAlreadyExists();

    await injectContentScript();
  });

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />

        <h1 class="text-xl font-bold">nixi</h1>

        <div class="px-8 py-8">
          <button
            type="button"
            class="rounded-2xl bg-emerald-500 transition duration-500 ease-in-out hover:bg-green-500"
            onClick={fetchPage}
            onKeyUp={fetchPage}
          >
            Save Article
          </button>
          <div class="mt-4 w-full">
            <Tags />
          </div>
        </div>

        <div class="absolute inset-x-0 bottom-0 text-sm">
          Built with Vite and TypeScript -{' '}
          <a
            onClick={logout}
            onKeyUp={logout}
            class="font-medium text-fuchsia-500 hover:text-fuchsia-300"
          >
            Logout
          </a>
        </div>
      </header>
    </div>
  );
};

export default Save;
