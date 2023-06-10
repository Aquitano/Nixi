import { Component, lazy, onMount, Show, Suspense } from 'solid-js';
import wretch from 'wretch';
import { CreateArticleDto } from '../../assets/dto';
import logo from '../../assets/logo.svg';
import { ArticleSchema } from '../../assets/schema';
import { articleId, setArticleId } from '../App';
import { addMessage, assertIsDefined, ColorClasses } from '../utils';
import { logout } from './auth/utils';
import styles from './Save.module.css';

const Tags = lazy(() => import('./Tags'));

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
	assertIsDefined(url);

	return wretch(`http://localhost:8200/articles/url/${encodeURIComponent(url)}`)
		.get()
		.notFound(() => false)
		.json((data: unknown) => {
			const article = ArticleSchema.parse(data);
			setArticleId(article.id.toString());
			return true;
		})
		.catch((error) => {
			addMessage(`Error checking if article exists - ${error}`, ColorClasses.error);
			console.error(error);
			return false;
		});
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
		const response = await wretch(`http://localhost:8200/articles/${articleId()}?format=markdown`)
			.get()
			.json();
		console.log(response);
		return;
	}

	await wretch('http://localhost:8200/articles')
		.post(data)
		.json((result: unknown) => {
			const article = ArticleSchema.parse(result);
			addMessage(`Article saved successfully - ${article.id} `, ColorClasses.success);
			setArticleId(article.id.toString());
		})
		.catch((error) => {
			addMessage(`Error saving article - ${error}`, ColorClasses.error);
			console.error(error);
		});
}

/**
 * Fetches data from the current tab and sends it to the server
 *
 * @returns {Promise<void>}
 */
async function fetchPage(): Promise<void> {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	assertIsDefined(tab.id);

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
						class="rounded-2xl bg-emerald-500 transition duration-500 ease-in-out hover:bg-green-600"
						onClick={fetchPage}
					>
						Save Article
					</button>

					<Show when={articleId() !== undefined}>
						<div class="mt-4 w-full">
							<Suspense fallback={<div>Loading...</div>}>
								<Tags />
							</Suspense>
						</div>
					</Show>
				</div>

				<div class="absolute inset-x-0 bottom-0 text-sm">
					Built with Vite and TypeScript -{' '}
					<button
						type="button"
						onClick={logout}
						class="reset p-0 font-medium text-fuchsia-500 transition-all duration-150 hover:text-fuchsia-300"
					>
						Logout
					</button>
				</div>
			</header>
		</div>
	);
};

export default Save;
