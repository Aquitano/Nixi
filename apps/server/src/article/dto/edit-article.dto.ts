import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export class EditArticleDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	title?: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	@Transform(({ value }) => {
		const { window } = new JSDOM();
		const purify = DOMPurify(window);
		const clean = purify.sanitize(value as string);
		return clean;
	})
	content?: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	description?: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	link?: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	top_image_url?: string;

	@ApiPropertyOptional()
	@IsBoolean()
	@IsOptional()
	favorite?: boolean;

	@ApiPropertyOptional()
	@IsInt()
	@IsOptional()
	word_count?: number;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	author?: string;
}
