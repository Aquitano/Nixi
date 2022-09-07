import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

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
