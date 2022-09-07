import { IsOptional, IsString } from 'class-validator';

export class EditArticleDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  author?: string;
}
