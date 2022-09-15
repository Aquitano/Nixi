import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddHighlightDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  start: number;

  @IsNumber()
  @IsNotEmpty()
  end: number;

  @IsNumber()
  @IsNotEmpty()
  articleId: number;
}
