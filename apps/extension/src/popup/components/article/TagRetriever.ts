import wretch from 'wretch';
import { Tag } from '../../../assets/schema';
import { articleId } from '../../App';
import { assertIsDefined } from '../../utils';

const API_URL = 'http://localhost:8200/articles';

/**
 * Retrieves a tag by its ID.
 *
 * @param {string} id
 * @returns {Promise<Tag | null>}
 */
export async function getTag(id: string): Promise<Tag | null> {
	try {
		return await wretch(`${API_URL}/tags/${id}`).get().json();
	} catch {
		return null;
	}
}

export function getUserTags(): Promise<Tag[]> {
	return wretch(`${API_URL}/tags`).get().json();
}

export function getArticleTags(): Promise<Tag[]> {
	const id = articleId();
	assertIsDefined(id);
	return wretch(`${API_URL}/${id}/tags`).get().json();
}
