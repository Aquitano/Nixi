import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Article, Highlight, Tag } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AddHighlightDto, CreateArticleDto, EditArticleDto } from './dto';

enum ErrorMessages {
  RESOURCE_ACCESS_DENIED = 'Access to resources denied',
  RESOURCES_NOT_FOUND = 'Article or Tag not found',
  ARTICLE_NOT_FOUND = 'Article not found',
}

type ArticleData = Article & { tags: Tag[]; highlights: Highlight[] };

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
  createArticle(profileId: string, dto: CreateArticleDto): Promise<Article> {
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
   * @returns {Promise<Article>} A promise that resolves to the retrieved article.
   * @throws {NotFoundException} If the article does not exist.
   */
  async getArticleById(profileId: string, articleId: number): Promise<Article> {
    // get the article by id
    const article = await this.prisma.article.findFirst({
      where: {
        id: articleId,
        profileId,
      },
    });

    // check if article exists
    if (!article) throw new NotFoundException(ErrorMessages.ARTICLE_NOT_FOUND);

    // Return the article
    return article;
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
  async generateHTML(data: ArticleData): Promise<string> {
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
   * Exports an article in a specific format.
   *
   * @param {string} profileId - The ID of the user's profile.
   * @param {string} format - The format to export the article in.
   * @param {number} articleId - The ID of the article to export.
   * @returns {Promise<Article | string>} A promise that resolves to the exported article.
   * @throws {ForbiddenException} If the user does not own the article.
   * @throws {NotFoundException} If the article does not exist.
   * @throws {NotFoundException} If the format does not exist.
   */
  async exportArticle(
    profileId: string,
    format: string,
    articleId: number,
  ): Promise<Article | string> {
    // get the article by id
    const article = await this.prisma.article.findUnique({
      where: {
        id: articleId,
      },
      include: {
        highlights: true,
        tags: true,
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
        // TODO: Implement Markdown export
        break;
      default:
        throw new NotFoundException('Format not found');
    }

    return null;
  }

  /* Highlights */

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

  /* Tags */

  /**
   * Retrieves all tags used by a specific article.
   *
   * @param {string} profileId - The ID of the user's profile.
   * @param {number} articleId - The ID of the article.
   * @returns {Promise<Tag[]>} A promise that resolves to the tags used by the article.
   * @throws {NotFoundException} If the article does not exist.
   * @throws {ForbiddenException} If the user does not own the article.
   */
  async getTagsUsedByArticle(profileId: string, articleId: number): Promise<Tag[]> {
    // get the article by id
    const article = await this.prisma.article.findUnique({
      where: {
        id: articleId,
      },
      select: {
        profileId: true,
      },
    });

    // check if article exists
    if (!article) throw new NotFoundException(ErrorMessages.ARTICLE_NOT_FOUND);

    // check if user owns the article
    if (article.profileId !== profileId)
      throw new ForbiddenException(ErrorMessages.RESOURCE_ACCESS_DENIED);

    // Get all tags used by the article
    return this.prisma.tag.findMany({
      where: {
        articles: {
          some: {
            id: articleId,
          },
        },
      },
    });
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
  ): Promise<Article> {
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
    });
  }
}
