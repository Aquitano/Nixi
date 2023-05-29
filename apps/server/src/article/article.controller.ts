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
  Query,
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
  createArticle(@GetUser('id') profileId: string, @Body() dto: CreateArticleDto) {
    return this.articleService.createArticle(profileId, dto);
  }

  @Get()
  getArticles(@GetUser('id') profileId: string) {
    return this.articleService.getArticles(profileId);
  }

  @Get(':id')
  getArticleById(@GetUser('id') profileId: string, @Param('id', ParseIntPipe) articleId: number) {
    return this.articleService.getArticleById(profileId, articleId);
  }

  @Get('url/:url')
  getArticleByUrl(@GetUser('id') profileId: string, @Param('url') url: string) {
    return this.articleService.getArticleByUrl(profileId, url);
  }

  @Patch(':id')
  editArticleById(
    @GetUser('id') profileId: string,
    @Param('id', ParseIntPipe) articleId: number,
    @Body() dto: EditArticleDto,
  ) {
    return this.articleService.editArticleById(profileId, articleId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteArticleById(
    @GetUser('id') profileId: string,
    @Param('id', ParseIntPipe) articleId: number,
  ) {
    return this.articleService.deleteArticleById(profileId, articleId);
  }

  @Get('export')
  exportArticle(
    @GetUser('id') profileId: string,
    @Query('format') format: string,
    @Query('id') articleId: number,
  ) {
    return this.articleService.exportArticle(profileId, format, articleId);
  }

  // Highlights

  @Get('highlights/:id')
  getHighlights(@GetUser('id') profileId: string, @Param('id', ParseIntPipe) highlightId: number) {
    return this.articleService.getHighlights(profileId, highlightId);
  }

  @Post('highlights/:id')
  addHighlight(@GetUser('id') profileId: string, @Body() dto: AddHighlightDto) {
    return this.articleService.addHighlight(profileId, dto);
  }

  @Delete('highlights/:id')
  deleteHighlight(
    @GetUser('id') profileId: string,
    @Param('id', ParseIntPipe) highlightId: number,
  ) {
    return this.articleService.deleteHighlightById(profileId, highlightId);
  }

  // Tags

  @Get('tags/:id')
  getTags(@GetUser('id') profileId: string, @Param('id', ParseIntPipe) articleId: number) {
    return this.articleService.getTagsUsedByArticle(profileId, articleId);
  }

  // get tag by value
  @Get('tags/name/:name')
  getTag(@GetUser('id') profileId: string, @Param('name') name: string) {
    return this.articleService.getTag(profileId, name);
  }

  @Post('tags')
  createTag(@GetUser('id') profileId: string, @Body('name') name: string) {
    return this.articleService.createTag(profileId, name);
  }

  @Post('tags/:id')
  addTag(
    @GetUser('id') profileId: string,
    @Param('id', ParseIntPipe) articleId: number,
    @Body('tagId') tagId: number,
  ) {
    return this.articleService.addTagToArticle(profileId, articleId, tagId);
  }

  @Delete('tags/:id')
  deleteTag(
    @GetUser('id') profileId: string,
    @Param('id', ParseIntPipe) articleId: number,
    @Body('tagId') tagId: number,
  ) {
    return this.articleService.removeTagFromArticle(profileId, articleId, tagId);
  }
}
