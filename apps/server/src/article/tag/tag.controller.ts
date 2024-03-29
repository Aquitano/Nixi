import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { GetUser } from '../../auth/decorator';
import { AuthGuard } from '../../auth/guard';
import { TagService } from './tag.service';

@UseGuards(AuthGuard)
@Controller('articles/tags')
export class TagController {
	constructor(private tagService: TagService) {}

	@Get()
	getAllTags(@GetUser('id') profileId: string) {
		return this.tagService.getAllTags(profileId);
	}

	@Get(':id')
	getTags(@GetUser('id') profileId: string, @Param('id') tagId: string) {
		return this.tagService.getTagById(profileId, tagId);
	}

	// get tag by value
	@Get('name/:name')
	getTag(@GetUser('id') profileId: string, @Param('name') name: string) {
		return this.tagService.getTag(profileId, name);
	}

	@Post()
	createTag(@GetUser('id') profileId: string, @Body('name') name: string) {
		return this.tagService.createTag(profileId, name);
	}

	@Post(':id')
	addTag(
		@GetUser('id') profileId: string,
		@Param('id') articleId: string,
		@Body('tagId') tagId: string,
	) {
		return this.tagService.addTagToArticle(profileId, articleId, tagId);
	}

	@Delete(':id')
	removeTag(
		@GetUser('id') profileId: string,
		@Param('id') articleId: string,
		@Query('tagId') tagId: string,
	) {
		return this.tagService.removeTagFromArticle(profileId, articleId, tagId);
	}
}
