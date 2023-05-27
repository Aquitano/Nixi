import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    const { window } = new JSDOM('');
    const purify = DOMPurify(window);
    const clean = purify.sanitize(value);
    return clean;
  })
  content: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  link: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  top_image_url?: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  favorite: boolean;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  word_count: number;
}
