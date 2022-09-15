import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddHighlightDto, CreateArticleDto, EditArticleDto } from './dto';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async createArticle(userId: string, dto: CreateArticleDto) {
    return this.prisma.article.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async getArticles(userId: string) {
    return this.prisma.article.findMany({
      where: {
        userId,
      },
    });
  }

  async getArticleById(userId: string, articleId: number) {
    const output = await this.prisma.article.findFirst({
      where: {
        id: articleId,
        userId,
      },
    });
    return output;
  }

  async editArticleById(userId: string, articleId: number, dto: EditArticleDto) {
    // get the article by id
    const article = await this.prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });

    // check if user owns the article
    if (!article || article.userId !== userId)
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

  async deleteArticleById(userId: string, articleId: number) {
    // get the article by id
    const article = await this.prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });

    // check if user owns the article
    if (!article || article.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.article.delete({
      where: {
        id: articleId,
      },
    });
  }

  // Highlights

  async getHighlights(userId: string, highlightId: number) {
    // get the article by id
    const article = await this.prisma.article.findUnique({
      where: {
        id: highlightId,
      },
    });

    // check if user owns the article
    if (!article || article.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.highlight.findMany({
      where: {
        articleId: highlightId,
      },
    });
  }

  async addHighlight(userId: string, dto: AddHighlightDto) {
    // check if article exists
    const article = await this.prisma.article.findUnique({
      where: {
        id: dto.articleId,
      },
    });

    // check if user owns the article
    if (!article || article.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.highlight.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async deleteHighlightById(userId: string, highlightId: number) {
    // get the highlight by id
    const highlight = await this.prisma.highlight.findUnique({
      where: {
        id: highlightId,
      },
    });

    // check if user owns the article
    if (!highlight || highlight.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.highlight.delete({
      where: {
        id: highlightId,
      },
    });
  }
}
