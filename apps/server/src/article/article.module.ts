import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { HighlightController } from './highlight/article.controller';
import { HighlightService } from './highlight/article.service';
import { TagController } from './tag/tag.controller';
import { TagService } from './tag/tag.service';

@Module({
	controllers: [TagController, HighlightController, ArticleController],
	providers: [TagService, HighlightService, ArticleService],
})
export class ArticleModule {}
