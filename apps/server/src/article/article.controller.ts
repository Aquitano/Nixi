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
import { AuthGuard } from '../auth/guard';
import { ArticleService } from './article.service';
import { AddHighlightDto, CreateArticleDto, EditArticleDto } from './dto';

@UseGuards(AuthGuard)
@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Post()
  createArticle(@GetUser('id') profileId: number, @Body() dto: CreateArticleDto) {
    return this.articleService.createArticle(profileId, dto);
  }

  @Get()
  getArticles(@GetUser('id') profileId: number) {
    return this.articleService.getArticles(profileId);
  }

  @Get(':id')
  getArticleById(@GetUser('id') profileId: number, @Param('id', ParseIntPipe) articleId: number) {
    return this.articleService.getArticleById(profileId, articleId);
  }

  @Patch(':id')
  editArticleById(
    @GetUser('id') profileId: number,
    @Param('id', ParseIntPipe) articleId: number,
    @Body() dto: EditArticleDto,
  ) {
    return this.articleService.editArticleById(profileId, articleId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteArticleById(
    @GetUser('id') profileId: number,
    @Param('id', ParseIntPipe) articleId: number,
  ) {
    return this.articleService.deleteArticleById(profileId, articleId);
  }

  // Highlights

  @Get('highlights/:id')
  getHighlights(@GetUser('id') profileId: number, @Param('id', ParseIntPipe) highlightId: number) {
    return this.articleService.getHighlights(profileId, highlightId);
  }

  @Post('highlights/:id')
  addHighlight(@GetUser('id') profileId: number, @Body() dto: AddHighlightDto) {
    return this.articleService.addHighlight(profileId, dto);
  }

  @Delete('highlights/:id')
  deleteHighlight(
    @GetUser('id') profileId: number,
    @Param('id', ParseIntPipe) highlightId: number,
  ) {
    return this.articleService.deleteHighlightById(profileId, highlightId);
  }
}
