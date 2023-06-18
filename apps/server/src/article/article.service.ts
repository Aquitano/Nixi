import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Article, Highlight, Tag } from '@prisma/client';
import TurndownService from 'turndown';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto, EditArticleDto } from './dto';

enum ErrorMessages {
	RESOURCE_ACCESS_DENIED = 'Access to resources denied',
	RESOURCES_NOT_FOUND = 'Article or Tag not found',
	ARTICLE_NOT_FOUND = 'Article not found',
}

type ArticleData = Article & { tags: Tag[]; highlights: Highlight[] };

const turndownService = new TurndownService({
	headingStyle: 'atx',
	hr: '---',
	bulletListMarker: '-',
	codeBlockStyle: 'fenced',
	fence: '```',
	emDelimiter: '_',
	strongDelimiter: '**',
});

@Injectable()
export class ArticleService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Creates a new article.
	 *
	 * @param {string} profileId - The ID of the user's profile.
	 * @param {CreateArticleDto} dto - Data transfer object containing the details of the article to be created.
	 * @returns {Promise<Article>} A promise that resolves to the created article.
	 */
	async createArticle(profileId: string, dto: CreateArticleDto): Promise<Article> {
		// check if the article already exists
		const article = await this.prisma.article.findUnique({
			where: {
				link_profile: {
					link: dto.link,
					profileId,
				},
			},
		});

		// if the article already exists, throw an error
		if (article) throw new ForbiddenException('Article already exists');

		return this.prisma.article.create({
			data: {
				profileId,
				...dto,
			},
		});
	}

	/**
	 * Retrieves all articles for a specific profile.
	 *
	 * @param {string} profileId - The ID of the user's profile.
	 * @returns {Promise<Article[]>} A promise that resolves to the retrieved articles.
	 */
	getArticles(profileId: string): Promise<Article[]> {
		return this.prisma.article.findMany({
			where: {
				profileId,
			},
		});
	}

	/**
	 * Retrieves an article by its ID.
	 *
	 * @param {string} profileId - The ID of the user's profile.
	 * @param {number} articleId - The ID of the article to be retrieved.
	 * @param {string} format - The format to export the article in.
	 * @returns {Promise<Article | string>} A promise that resolves to the retrieved article.
	 * @throws {ForbiddenException} If the user does not own the article.
	 * @throws {NotFoundException} If the article does not exist.
	 * @throws {NotFoundException} If the format does not exist.
	 */
	async getArticleById(
		profileId: string,
		articleId: number,
		format: string,
	): Promise<Article | string> {
		// get the article by id
		const article = await this.prisma.article.findFirst({
			where: {
				id: articleId,
				profileId,
			},
			include: {
				tags: true,
				highlights: true,
			},
		});

		// check if article exists
		if (!article) throw new NotFoundException(ErrorMessages.ARTICLE_NOT_FOUND);

		// check if user owns the article
		if (article.profileId !== profileId)
			throw new ForbiddenException(ErrorMessages.RESOURCE_ACCESS_DENIED);

		switch (format) {
			case 'json':
				return article;
			case 'html':
				return this.generateHTML(article);
			case 'markdown':
				return this.generateMarkdown(article);
			default:
				throw new NotFoundException('Format not found');
		}
	}

	/**
	 * Retrieves an article by its URL.
	 *
	 * @param {string} profileId - The ID of the user's profile.
	 * @param {string} url - The URL of the article to be retrieved.
	 * @returns {Promise<Article>} A promise that resolves to the retrieved article.
	 * @throws {NotFoundException} If the article does not exist.
	 */
	async getArticleByUrl(profileId: string, url: string): Promise<Article> {
		// get the article by url
		const article = await this.prisma.article.findUnique({
			where: {
				link_profile: {
					link: url,
					profileId,
				},
			},
		});

		// check if article exists
		if (!article) throw new NotFoundException(ErrorMessages.ARTICLE_NOT_FOUND);

		// Return the article
		return article;
	}

	/**
	 * Get tags for a specific article.
	 *
	 * @param {string} profileId - The ID of the user's profile.
	 * @param {number} articleId - The ID of the article to get tags for.
	 * @returns {Promise<Tag[]>} A promise that resolves to the retrieved tags.
	 * @throws {ForbiddenException} If the user does not own the article.
	 * @throws {NotFoundException} If the article does not exist.
	 */
	async getTagsUsedByArticle(profileId: string, articleId: number): Promise<Tag[]> {
		// get the article by id
		const article = await this.prisma.article.findFirst({
			where: {
				id: articleId,
				profileId,
			},
			select: {
				profileId: true,
				tags: true,
			},
		});

		// check if article exists
		if (!article) throw new NotFoundException(ErrorMessages.ARTICLE_NOT_FOUND);

		// check if user owns the article
		if (article.profileId !== profileId)
			throw new ForbiddenException(ErrorMessages.RESOURCE_ACCESS_DENIED);

		// Return the tags
		return article.tags;
	}

	/**
	 * Edits an article by its ID.
	 *
	 * @param {string} profileId - The ID of the user's profile.
	 * @param {number} articleId - The ID of the article to be edited.
	 * @param {EditArticleDto} dto - Data transfer object containing the new details of the article.
	 * @returns {Promise<Article>} A promise that resolves to the updated article.
	 * @throws {NotFoundException} If the article does not exist.
	 * @throws {ForbiddenException} If the user does not own the article.
	 */
	async editArticleById(
		profileId: string,
		articleId: number,
		dto: EditArticleDto,
	): Promise<Article> {
		// get the article by id
		const article = await this.prisma.article.findUnique({
			where: { id: articleId },
		});

		// check if article exists
		if (!article) throw new NotFoundException(ErrorMessages.ARTICLE_NOT_FOUND);

		// check if user owns the article
		if (article.profileId !== profileId)
			throw new ForbiddenException(ErrorMessages.RESOURCE_ACCESS_DENIED);

		// Update the article
		return this.prisma.article.update({
			where: {
				id: articleId,
			},
			data: {
				...dto,
			},
		});
	}

	/**
	 * Deletes an article by its ID.
	 *
	 * @param {string} profileId - The ID of the user's profile.
	 * @param {number} articleId - The ID of the article to be deleted.
	 * @returns {Promise<void>} A promise that resolves when the article is deleted.
	 * @throws {NotFoundException} If the article does not exist.
	 * @throws {ForbiddenException} If the user does not own the article.
	 */
	async deleteArticleById(profileId: string, articleId: number): Promise<void> {
		// get the article by id
		const article = await this.prisma.article.findUnique({
			where: { id: articleId },
		});

		// check if article exists
		if (!article) throw new NotFoundException(ErrorMessages.ARTICLE_NOT_FOUND);

		// check if user owns the article
		if (article.profileId !== profileId)
			throw new ForbiddenException(ErrorMessages.RESOURCE_ACCESS_DENIED);

		// Delete the article
		await this.prisma.article.delete({
			where: {
				id: articleId,
			},
		});
	}

	/**
	 * Generates an HTML file for an article.
	 *
	 * @param {ArticleData} data - The article data.
	 * @returns {Promise<string>} A promise that resolves to the generated HTML.
	 */
	generateHTML(data: ArticleData): string {
		return `<!DOCTYPE html>
    <html>
    <head>
      <title>${data.title}</title>
      <style>
      :root{--color-canvas:hsl(27,14%,15%);--color-textPrimary:hsl(33,59%,88%);--color-textLinkHover:#00a69c;--font-main:'Iosevka Curly Medium'}*,:after,:before{box-sizing:border-box}body{background-color:var(--color-canvas);color:var(--color-textPrimary);font-family:var(--font-main),sans-serif}main{max-width:850px;margin:2.5rem auto;width:100%;line-height:1.5;font-size:22px}h1{font-size:40px;font-weight:900;text-align:center;line-height:1.2;padding-bottom:.625em;margin:0}p{margin:0 0 1em;text-align:justify}a{cursor:pointer;color:var(--color-textPrimary);-webkit-text-decoration:none;text-decoration:none;position:relative;text-shadow:-1px -1px 0 var(--color-canvas),1px -1px 0 var(--color-canvas),-1px 1px 0 var(--color-canvas),1px 1px 0 var(--color-canvas);background-image:linear-gradient(to top,transparent,transparent 1px,var(--color-textPrimary) 1px,var(--color-textPrimary) 2px,transparent 2px);transition:color .1s ease-out}a:hover{color:var(--color-textLinkHover);background-image:linear-gradient(to top,transparent,transparent 1px,var(--color-textLinkHover) 1px,var(--color-textLinkHover) 2px,transparent 2px)}a span{text-shadow:-1px -1px 0 #fbf099,1px -1px 0 #fbf099,-1px 1px 0 #fbf099,1px 1px 0 #fbf099!important;background-image:linear-gradient(0deg,transparent,transparent 1px,#333 0,#333 2px,transparent 0)}span{position:relative;background-color:#fbf099;color:#1a1a1a}img{display:block;object-fit:cover;border-radius:1px;pointer-events:auto;width:100%}.front-matter{line-height:1rem;border-radius:12px;border-style:solid;padding:10px;margin:1em 0;font-family:var(--font-main),sans-serif;white-space:pre-wrap;background:hsl(30,15%,13%);color:hsla(43,100%,42%,.747)}hr{margin-bottom:1em}
      </style>
    </head>
    <body>
      <main>
        <pre class="front-matter">
          <li>Author: ${data.author}</li>
          <li>Created at: ${new Date(data.createdAt).toLocaleString()}</li>
          <li>Updated at: ${new Date(data.updatedAt).toLocaleString()}</li>
          <li>Word count: ${data.word_count}</li>
          <li>Tags: ${data.tags.map((tag: Tag) => tag.name).join(', ')}</li>
        </pre>
        <h1>${data.title}</h1>
        <hr />
        <div>${data.content}</div>
      </main>
    </body>
    </html>`;
	}

	/**
	 * Generates a Markdown file for an article.
	 *
	 * @param {ArticleData} data - The article data.
	 * @returns {string} The generated Markdown.
	 */
	generateMarkdown(data: ArticleData): string {
		const md = turndownService.turndown(`<h1>${data.title}</h1><hr /><div>${data.content}</div>`);

		// Add front matter
		const frontMatter =
			'---\n' +
			`Author: ${data.author}\n` +
			`Created at: ${new Date(data.createdAt).toLocaleString()}\n` +
			`Updated at: ${new Date(data.updatedAt).toLocaleString()}\n` +
			`Word count: ${data.word_count}\n` +
			`Tags: ${data.tags.map((tag: Tag) => tag.name).join(', ')}\n` +
			'---\n\n';

		return frontMatter + md;
	}
}
