import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    const { window } = new JSDOM('');
    const purify = DOMPurify(window);
    const clean = purify.sanitize(value);
    return clean;
  })
  content: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsOptional()
  top_image_url?: string;

  @IsBoolean()
  @IsNotEmpty()
  favorite: boolean;

  @IsInt()
  @IsNotEmpty()
  word_count: number;
}
