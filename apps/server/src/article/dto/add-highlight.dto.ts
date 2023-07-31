import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddHighlightDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	content: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	start: number;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	end: number;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	articleId: string;
}
