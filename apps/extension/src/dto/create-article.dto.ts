export class CreateArticleDto {
  title!: string;

  content!: string;

  description?: string;

  link!: string;

  author!: string;

  top_image_url?: string;

  favorite!: boolean;

  word_count!: number;
}
