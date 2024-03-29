/* eslint-disable no-console */
import { CreateArticleDto } from '../assets/dto';
import { countWords, hashString } from './utils';

/**
 * Get the article data from the current page
 *
 * @returns {CreateArticleDto | undefined} The article data
 */
function getArticleData(): CreateArticleDto | undefined {
	let data: CreateArticleDto | undefined;

	// Get only the domain name
	const domainId = hashString(window.location.hostname);

	if (domainId === -1671552769) {
		const title = document.querySelector('#__next > main > article > header > h1')?.textContent;

		const author = document.querySelector(
			'#__next > main > article > header > div.css-17pf1cy > div.css-1ba1zfw > span',
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
			word_count: countWords(content || ''),
		} as CreateArticleDto;
	}

	return data;
}

/**
 * Initialize the content script
 *
 * @returns {void}
 */
function init(): void {
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
		console.log(request);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (request.action === 'getArticleData') {
			const data = getArticleData();
			console.log(data);

			// Check if data is valid/not empty
			if (data) {
				sendResponse({ message: 'success', data });
			} else {
				console.log('Error: No data found');
				sendResponse({ message: 'error', data: null });
			}
		} else {
			sendResponse({ message: 'error', data: null });
		}
	});

	console.log('Nixi contentScript.js loaded');
}

init();

export {};
