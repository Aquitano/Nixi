import { z } from 'zod';
import { Article } from '../dto';

export const ArticleSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  title: z.string(),
  link: z.string(),
  author: z.string(),
  top_image_url: z.string().nullable(),
  favorite: z.boolean(),
  word_count: z.number(),
  description: z.string().nullable(),
  content: z.string(),
  profileId: z.string(),
});

/* Check if the schema matches the type from the API */
type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T ? 1 : 2) extends <
  G,
>() => G extends U ? 1 : 2
  ? Y
  : N;

/** Trigger a compiler error when a value is _not_ an exact type. */
declare const exactType: <T, U>(
  draft: T & IfEquals<T, U>,
  expected: U & IfEquals<T, U>,
) => IfEquals<T, U>;

type ArticleType = z.infer<typeof ArticleSchema>;

exactType({} as ArticleType, {} as Article);
