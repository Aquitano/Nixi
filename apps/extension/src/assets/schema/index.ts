import { z } from 'zod';

export const ArticleSchema = z.object({
  id: z.number(),
  createdAt: z.string().transform((val) => new Date(val)),
  updatedAt: z.string().transform((val) => new Date(val)),
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

export const tagSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  profileId: z.string(),
});

export const highlightSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  content: z.string(),
  start: z.number(),
  end: z.number(),
  articleId: z.number(),
  profileId: z.string(),
});

export type Article = z.infer<typeof ArticleSchema>;
export type Tag = z.infer<typeof tagSchema>;
export type Highlight = z.infer<typeof highlightSchema>;
