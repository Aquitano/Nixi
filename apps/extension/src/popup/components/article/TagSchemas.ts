import { z } from 'zod';

export const addTagSchema = z.object({
	id: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
	title: z.string(),
	link: z.string(),
	author: z.string(),
	top_image_url: z.null(),
	favorite: z.boolean(),
	word_count: z.number(),
	description: z.null(),
	content: z.string(),
	profileId: z.string(),
	tags: z.array(
		z.object({
			id: z.number(),
			createdAt: z.string().transform((val) => new Date(val)),
			updatedAt: z.string().transform((val) => new Date(val)),
			name: z.string(),
			profileId: z.string(),
		}),
	),
});

export const removeTagSchema = z.object({
	id: z.number(),
	tags: z.array(
		z.object({
			id: z.number(),
			createdAt: z.string().transform((val) => new Date(val)),
			updatedAt: z.string().transform((val) => new Date(val)),
			name: z.string(),
			profileId: z.string(),
		}),
	),
});
