import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { ArticleService } from './article.service';
import { CreateArticleDto, EditArticleDto } from './dto';

@UseGuards(JwtGuard)
@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Post()
  createArticle(@GetUser('id') userId: string, @Body() dto: CreateArticleDto) {
    return this.articleService.createArticle(userId, dto);
  }

  @Get()
  getArticles(@GetUser('id') userId: string) {
    return this.articleService.getArticles(userId);
  }

  @Get(':id')
  getArticleById(@GetUser('id') userId: string, @Param('id', ParseIntPipe) articleId: number) {
    return this.articleService.getArticleById(userId, articleId);
  }

  @Patch(':id')
  editArticleById(
    @GetUser('id') userId: string,
    @Param('id', ParseIntPipe) articleId: number,
    @Body() dto: EditArticleDto,
  ) {
    return this.articleService.editArticleById(userId, articleId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteArticleById(@GetUser('id') userId: string, @Param('id', ParseIntPipe) articleId: number) {
    return this.articleService.deleteArticleById(userId, articleId);
  }
}
