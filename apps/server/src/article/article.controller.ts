import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { AuthGuard } from '../auth/guard';
import { ArticleService } from './article.service';
import { CreateArticleDto, EditArticleDto } from './dto';

@UseGuards(AuthGuard)
@Controller('articles')
export class ArticleController {
	constructor(private articleService: ArticleService) {}

	@Get()
	getArticles(@GetUser('id') profileId: string) {
		return this.articleService.getArticles(profileId);
	}

	@Get('url/:url')
	getArticleByUrl(@GetUser('id') profileId: string, @Param('url') url: string) {
		return this.articleService.getArticleByUrl(profileId, url);
	}

	@Get(':id/tags')
	getArticleTags(@GetUser('id') profileId: string, @Param('id') articleId: string) {
		return this.articleService.getTagsUsedByArticle(profileId, articleId);
	}

	@Get(':id')
	getArticleById(
		@GetUser('id') profileId: string,
		@Param('id') articleId: string,
		@Query('format') format = 'json',
	) {
		return this.articleService.getArticleById(profileId, articleId, format);
	}

	@Post()
	createArticle(@GetUser('id') profileId: string, @Body() dto: CreateArticleDto) {
		return this.articleService.createArticle(profileId, dto);
	}

	@Patch(':id')
	editArticleById(
		@GetUser('id') profileId: string,
		@Param('id') articleId: string,
		@Body() dto: EditArticleDto,
	) {
		return this.articleService.editArticleById(profileId, articleId, dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	deleteArticleById(@GetUser('id') profileId: string, @Param('id') articleId: string) {
		return this.articleService.deleteArticleById(profileId, articleId);
	}
}
