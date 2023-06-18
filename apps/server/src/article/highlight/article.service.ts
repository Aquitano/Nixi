import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Highlight } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AddHighlightDto } from '../dto';

enum ErrorMessages {
	RESOURCE_ACCESS_DENIED = 'Access to resources denied',
	RESOURCES_NOT_FOUND = 'Article or Tag not found',
	ARTICLE_NOT_FOUND = 'Article not found',
}
@Injectable()
export class HighlightService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Retrieves all highlights for a specific article.
	 *
	 * @param {string} profileId - The ID of the user's profile.
	 * @param {number} highlightId - The ID of the highlight.
	 * @returns {Promise<Highlight[]>} A promise that resolves to the highlights of the article.
	 * @throws {NotFoundException} If the article does not exist.
	 * @throws {ForbiddenException} If the user does not own the article.
	 */
	async getHighlights(profileId: string, highlightId: number): Promise<Highlight[]> {
		// get the article by id
		const article = await this.prisma.article.findUnique({
			where: { id: highlightId },
			select: {
				profileId: true,
			},
		});

		// check if article exists
		if (!article) throw new NotFoundException(ErrorMessages.ARTICLE_NOT_FOUND);

		// check if user owns the article
		if (article.profileId !== profileId)
			throw new ForbiddenException(ErrorMessages.RESOURCE_ACCESS_DENIED);

		// Get all highlights for the article
		return this.prisma.highlight.findMany({
			where: {
				articleId: highlightId,
			},
		});
	}

	/**
	 * Adds a highlight to an article.
	 *
	 * @param {string} profileId - The ID of the user's profile.
	 * @param {AddHighlightDto} dto - Data transfer object containing the details of the highlight to be added.
	 * @returns {Promise<Highlight>} A promise that resolves to the created highlight.
	 * @throws {NotFoundException} If the article does not exist.
	 * @throws {ForbiddenException} If the user does not own the article.
	 */
	async addHighlight(profileId: string, dto: AddHighlightDto): Promise<Highlight> {
		// check if article exists
		const article = await this.prisma.article.findUnique({
			where: { id: dto.articleId },
			select: {
				profileId: true,
			},
		});

		// check if article exists
		if (!article) throw new NotFoundException(ErrorMessages.ARTICLE_NOT_FOUND);

		// check if user owns the article
		if (article.profileId !== profileId)
			throw new ForbiddenException(ErrorMessages.RESOURCE_ACCESS_DENIED);

		// Create the highlight
		return this.prisma.highlight.create({
			data: {
				profileId,
				...dto,
			},
		});
	}

	/**
	 * Deletes a highlight by its ID.
	 *
	 * @param {string} profileId - The ID of the user's profile.
	 * @param {number} highlightId - The ID of the highlight to be deleted.
	 * @throws {ForbiddenException} If the user does not own the highlight.
	 */
	async deleteHighlightById(profileId: string, highlightId: number) {
		// get the highlight by id
		const highlight = await this.prisma.highlight.findUnique({
			where: {
				id: highlightId,
			},
			select: {
				profileId: true,
			},
		});

		// check if user owns the article
		if (!highlight || highlight.profileId !== profileId)
			throw new ForbiddenException(ErrorMessages.RESOURCE_ACCESS_DENIED);

		await this.prisma.highlight.delete({
			where: {
				id: highlightId,
			},
		});
	}
}
