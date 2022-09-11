import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export class EditArticleDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    const { window } = new JSDOM('');
    const purify = DOMPurify(window);
    const clean = purify.sanitize(value);
    return clean;
  })
  content?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  top_image_url?: string;

  @IsBoolean()
  @IsOptional()
  favorite?: boolean;

  @IsInt()
  @IsOptional()
  word_count?: number;

  @IsString()
  @IsOptional()
  author?: string;
}
