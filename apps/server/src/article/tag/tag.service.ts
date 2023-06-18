import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Article, Tag } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

enum ErrorMessages {
	RESOURCE_ACCESS_DENIED = 'Access to resources denied',
	RESOURCES_NOT_FOUND = 'Article or Tag not found',
	ARTICLE_NOT_FOUND = 'Article not found',
}

@Injectable()
export class TagService {
	constructor(private prisma: PrismaService) {}

	/* Tags */

	/**
	 * Retrieves all tags for a specific user.
	 *
	 * @param {string} profileId - The ID of the user's profile.
	 * @returns {Promise<Tag[]>} A promise that resolves to the tags of the user.
	 */
	async getAllTags(profileId: string): Promise<Tag[]> {
		return this.prisma.tag.findMany({
			where: {
				profileId,
			},
		});
	}

	async getTagById(profileId: string, tagId: number): Promise<Tag> {
		const tag = await this.prisma.tag.findUnique({
			where: {
				id: tagId,
			},
		});

		if (!tag) {
			throw new NotFoundException(ErrorMessages.RESOURCES_NOT_FOUND);
		}

		if (tag.profileId !== profileId) {
			throw new ForbiddenException(ErrorMessages.RESOURCE_ACCESS_DENIED);
		}

		return tag;
	}

	/**
	 * Retrieves a tag by its name for a specific profile.
	 *
	 * @param {string} profileId - The ID of the user's profile.
	 * @param {string} tagName - The name of the tag to be retrieved.
	 * @returns {Promise<Tag>} A promise that resolves to the retrieved tag.
	 */
	getTag(profileId: string, tagName: string): Promise<Tag> {
		return this.prisma.tag.findUnique({
			where: {
				name_profile: {
					name: tagName,
					profileId,
				},
			},
		});
	}

	/**
	 * Creates a new tag.
	 *
	 * @param {string} profileId - The ID of the user's profile.
	 * @param {string} name - The name of the tag to be created.
	 * @returns {Promise<Tag>} A promise that resolves to the created tag.
	 */
	createTag(profileId: string, name: string): Promise<Tag> {
		return this.prisma.tag.create({
			data: {
				profileId,
				name,
			},
		});
	}

	/**
	 * Adds a tag to an article.
	 *
	 * @param {string} profileId - The ID of the user's profile.
	 * @param {number} articleId - The ID of the article to which the tag is to be added.
	 * @param {number} tagId - The ID of the tag to be added to the article.
	 * @returns {Promise<Article>} A promise that resolves to the updated article.
	 * @throws {NotFoundException} If the article or tag does not exist.
	 * @throws {ForbiddenException} If the user does not own the article or tag.
	 */
	async addTagToArticle(profileId: string, articleId: number, tagId: number): Promise<Article> {
		// get the article and tag by id concurrently
		const [article, tag] = await Promise.all([
			this.prisma.article.findUnique({
				where: { id: articleId },
				select: {
					profileId: true,
				},
			}),
			this.prisma.tag.findUnique({
				where: { id: tagId },
			}),
		]);

		// check if article and tag exist
		if (!article || !tag) throw new NotFoundException(ErrorMessages.RESOURCES_NOT_FOUND);

		// check if user owns the article and tag
		if (article.profileId !== profileId || tag.profileId !== profileId)
			throw new ForbiddenException(ErrorMessages.RESOURCE_ACCESS_DENIED);

		// add the tag to the article
		return this.prisma.article.update({
			where: { id: articleId },
			data: {
				tags: {
					connect: { id: tagId },
				},
			},
			include: {
				tags: true,
			},
		});
	}

	/**
	 * Removes a tag from an article.
	 *
	 * @param {string} profileId - The ID of the user's profile.
	 * @param {number} articleId - The ID of the article from which the tag is to be removed.
	 * @param {number} tagId - The ID of the tag to be removed from the article.
	 * @returns {Promise<Article>} A promise that resolves to the updated article.
	 * @throws {NotFoundException} If the article or tag does not exist.
	 * @throws {ForbiddenException} If the user does not own the article or tag.
	 */
	async removeTagFromArticle(
		profileId: string,
		articleId: number,
		tagId: number,
	): Promise<{ id: number; tags: Tag[] }> {
		// get the article and tag by id concurrently
		const [article, tag] = await Promise.all([
			this.prisma.article.findUnique({
				where: { id: articleId },
				select: {
					profileId: true,
				},
			}),
			this.prisma.tag.findUnique({
				where: { id: tagId },
			}),
		]);

		// check if article and tag exist
		if (!article || !tag) throw new NotFoundException(ErrorMessages.RESOURCES_NOT_FOUND);

		// check if user owns the article and tag
		if (article.profileId !== profileId || tag.profileId !== profileId)
			throw new ForbiddenException(ErrorMessages.RESOURCE_ACCESS_DENIED);

		// remove the tag from the article
		return this.prisma.article.update({
			where: { id: articleId },
			data: {
				tags: {
					disconnect: { id: tagId },
				},
			},
			select: {
				tags: true,
				id: true,
			},
		});
	}
}
