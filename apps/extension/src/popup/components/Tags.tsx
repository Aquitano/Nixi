import Tagify from '@yaireo/tagify';
import { Component, For, createSignal, onMount } from 'solid-js';
import wretch from 'wretch';
import { Tag } from '../../assets/schema';
import { articleId } from '../App';
import { assertIsDefined } from '../utils';
import Badge from './Badge';
import DropdownMain from './Dropdown';

interface BeforeAddDetails {
	data: {
		value: string;
		__isValid: boolean;
		__tagId: string;
	};
}

const API_URL = 'http://localhost:8200/articles';

/**
 * Checks if the tag already exists in the database
 *
 * @param {string} tag
 * @returns {Promise<Tag | null>}
 */
async function doesTagExist(tag: string): Promise<Tag | null> {
	try {
		return await wretch(`${API_URL}/tags/name/${tag}`).get().json();
	} catch {
		return null;
	}
}

function getTags(): Promise<Tag[]> {
	const id = articleId();
	assertIsDefined(id);
	return wretch(`${API_URL}/tags/${id}`).get().json();
}

/**
 * Adds a tag to the database
 *
 * @param {BeforeAddDetails} tag
 * @returns {Promise<void>}
 */
async function addTags(tag: BeforeAddDetails): Promise<void> {
	const dbTag = await doesTagExist(tag.data.value);
	let data: Tag;

	if (!dbTag) {
		data = await wretch(`${API_URL}/tags`).post({ name: tag.data.value }).json();
	} else {
		data = dbTag;
	}

	console.log(`Tag: ${data.name} ID: ${data.id}`);

	const id = articleId();
	assertIsDefined(id);
	wretch(`${API_URL}/tags/${id}`).post({ tagId: data.id });
}

const Tags: Component = () => {
	const [tagify, setTagify] = createSignal<Tagify>(null);
	const [tags, setTags] = createSignal<Tag[]>([]);

	/**
	 * Handles the beforeAdd event from Tagify
	 *
	 * @param {CustomEvent} e
	 * @returns {void}
	 */
	function beforeAdd(e: { detail: BeforeAddDetails }): void {
		const details = e.detail;
		console.log(details.data.value);

		// eslint-disable-next-line no-underscore-dangle
		if (details.data.__isValid) {
			// TODO: Add error message
			if (details.data.value.length > 40) return;
			addTags(details);
		}
	}

	/**
	 * Handles the click event on the add button
	 *
	 * @returns {void}
	 */
	function onAddButtonClick(): void {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		tagify().addEmptyTag();
	}

	onMount(() => {
		const input = document.querySelector('.customLook');
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
		const tag = new Tagify(input, {
			callbacks: {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				invalid: (e) => console.log('invalid', e.detail),
			},
			trim: true,
			dropdown: {
				position: 'text',
				enabled: 1,
			},
			editTags: false,
		});
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		tag.on('edit:updated', beforeAdd);

		setTagify(tag);

		if (articleId()) {
			getTags().then((data) => {
				setTags(data);
				console.log(data);
			});
		}
	});

	return (
		<>
			<For each={tags()}>{(tag) => <Badge name={tag.name} />}</For>
			<div class="mt-4 border-none">
				<input class="customLook" />
				<button type="button" onClick={onAddButtonClick}>
					+
				</button>
				<DropdownMain />
			</div>
		</>
	);
};

export default Tags;
