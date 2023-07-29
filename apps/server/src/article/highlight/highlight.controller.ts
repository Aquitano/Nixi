import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../../auth/decorator';
import { AuthGuard } from '../../auth/guard';
import { AddHighlightDto } from '../dto';
import { HighlightService } from './highlight.service';

@UseGuards(AuthGuard)
@Controller('articles/highlights')
export class HighlightController {
	constructor(private highlightService: HighlightService) {}

	@Get(':id')
	getHighlights(@GetUser('id') profileId: string, @Param('id') highlightId: string) {
		return this.highlightService.getHighlights(profileId, highlightId);
	}

	@Post(':id')
	addHighlight(@GetUser('id') profileId: string, @Body() dto: AddHighlightDto) {
		return this.highlightService.addHighlight(profileId, dto);
	}

	@Delete(':id')
	deleteHighlight(@GetUser('id') profileId: string, @Param('id') highlightId: string) {
		return this.highlightService.deleteHighlightById(profileId, highlightId);
	}
}
