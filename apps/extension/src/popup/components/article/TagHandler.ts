import wretch from 'wretch';
import { articleId } from '../../App';
import { assertIsDefined } from '../../utils';
import { setTags } from '../Tags';
import { getTag } from './TagRetriever';
import { addTagSchema, removeTagSchema } from './TagSchemas';

const API_URL = 'http://localhost:8200/articles';

/**
 * Adds a tag to the database
 *
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function addTag(id: number): Promise<void> {
	const article = articleId();
	assertIsDefined(article);
	const response = await wretch(`${API_URL}/tags/${article}`).post({ tagId: id }).json();

	const validatedResponse = addTagSchema.safeParse(response);

	if (validatedResponse.success) {
		setTags(validatedResponse.data.tags);
	} else {
		// TODO: Handle error
		console.log('error');
	}
}

/**
 * Removes a tag from the database
 *
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function removeTag(id: number): Promise<void> {
	const article = articleId();
	assertIsDefined(article);

	const tag = await getTag(id);

	if (!tag) {
		return;
	}

	console.log(article);

	const response = await wretch(`${API_URL}/tags/${article}?tagId=${id}`).delete().json();

	console.log(response);

	const validatedResponse = removeTagSchema.safeParse(response);

	if (validatedResponse.success) {
		setTags(validatedResponse.data.tags);
	} else {
		console.log('error');
	}
}
