import { produce } from 'solid-js/store';
import wretch from 'wretch';
import { Tag } from '../../../assets/schema';
import { articleId } from '../../App';
import { addMessage, assertIsDefined } from '../../utils';
import { setItems } from '../Dropdown';
import { setTags } from '../Tags';
import { getTag } from './TagRetriever';
import { addTagSchema, removeTagSchema } from './TagSchemas';

const API_URL = 'http://localhost:8200/articles';

/**
 * Adds a tag to the database
 *
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function addTag(id: string): Promise<void> {
	const article = articleId();
	assertIsDefined(article);
	const response = await wretch(`${API_URL}/tags/${article}`).post({ tagId: id }).json();

	const validatedResponse = addTagSchema.safeParse(response);

	if (validatedResponse.success) {
		setTags(validatedResponse.data.tags);
		setItems(
			(item) => item.id === id,
			produce((item) => {
				item.checked = true;
			}),
		);

		addMessage('Tag added successfully', 'SUCCESS');
	} else {
		console.log(validatedResponse.error);
		addMessage('Oops! Something went wrong.', 'ERROR');
	}
}

/**
 * Checks if the tag already exists in the database
 *
 * @param {string} tag
 * @returns {Promise<Tag | null>}
 */
export async function doesTagExist(tag: string): Promise<Tag | null> {
	try {
		return await wretch(`${API_URL}/tags/name/${tag}`).get().json();
	} catch {
		return null;
	}
}

/**
 * Creates a tag in the database
 * @param {string} tag
 * @returns {Promise<Tag>}
 */
export async function createTag(tag: string): Promise<Tag> {
	const response = await wretch(`${API_URL}/tags`).post({ name: tag }).json();

	return response as Tag;
}

/**
 * Removes a tag from the database
 *
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function removeTag(id: string): Promise<void> {
	const article = articleId();
	assertIsDefined(article);

	const tag = await getTag(id);

	if (!tag) {
		return;
	}

	const response = await wretch(`${API_URL}/tags/${article}?tagId=${id}`).delete().json();

	console.log(response);

	const validatedResponse = removeTagSchema.safeParse(response);

	if (validatedResponse.success) {
		setTags(validatedResponse.data.tags);
		setItems(
			(item) => item.id === id,
			produce((item) => {
				item.checked = false;
			}),
		);
		addMessage('Tag removed successfully', 'SUCCESS');
	} else {
		console.log(validatedResponse.error);
		addMessage('Oops! Something went wrong.', 'ERROR');
	}
}
