import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto, EditArticleDto } from './dto';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async createArticle(userId: string, dto: CreateArticleDto) {
    return this.prisma.article.create({
      // @ts-ignore
      data: {
        userId,
        ...dto,
      },
    });
  }

  getArticles(userId: string) {
    return this.prisma.article.findMany({
      where: {
        userId,
      },
    });
  }

  getArticleById(userId: string, articleId: number) {
    return this.prisma.article.findFirst({
      where: {
        id: articleId,
        userId,
      },
    });
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
}
