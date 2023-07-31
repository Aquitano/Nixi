import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditUserDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	firstName?: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	lastName?: string;
}
