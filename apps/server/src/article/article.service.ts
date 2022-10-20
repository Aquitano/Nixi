import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddHighlightDto, CreateArticleDto, EditArticleDto } from './dto';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async createArticle(profileId: string, dto: CreateArticleDto) {
    return this.prisma.article.create({
      data: {
        profileId,
        ...dto,
      },
    });
  }

  async getArticles(profileId: string) {
    return this.prisma.article.findMany({
      where: {
        profileId,
      },
    });
  }

  async getArticleById(profileId: string, articleId: number) {
    const output = await this.prisma.article.findFirst({
      where: {
        id: articleId,
        profileId,
      },
    });
    return output;
  }

  async editArticleById(profileId: string, articleId: number, dto: EditArticleDto) {
    // get the article by id
    const article = await this.prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });

    // check if user owns the article
    if (!article || article.profileId !== profileId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteArticleById(profileId: string, articleId: number) {
    // get the article by id
    const article = await this.prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });

    // check if user owns the article
    if (!article || article.profileId !== profileId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.article.delete({
      where: {
        id: articleId,
      },
    });
  }

  // Highlights

  async getHighlights(profileId: string, highlightId: number) {
    // get the article by id
    const article = await this.prisma.article.findUnique({
      where: {
        id: highlightId,
      },
    });

    // check if user owns the article
    if (!article || article.profileId !== profileId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.highlight.findMany({
      where: {
        articleId: highlightId,
      },
    });
  }

  async addHighlight(profileId: string, dto: AddHighlightDto) {
    // check if article exists
    const article = await this.prisma.article.findUnique({
      where: {
        id: dto.articleId,
      },
    });

    // check if user owns the article
    if (!article || article.profileId !== profileId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.highlight.create({
      data: {
        profileId,
        ...dto,
      },
    });
  }

  async deleteHighlightById(profileId: string, highlightId: number) {
    // get the highlight by id
    const highlight = await this.prisma.highlight.findUnique({
      where: {
        id: highlightId,
      },
    });

    // check if user owns the article
    if (!highlight || highlight.profileId !== profileId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.highlight.delete({
      where: {
        id: highlightId,
      },
    });
  }
}
