import { z } from 'zod';

export const addTagSchema = z.object({
	id: z.string(),
	tags: z.array(
		z.object({
			id: z.string(),
			createdAt: z.string().transform((val) => new Date(val)),
			updatedAt: z.string().transform((val) => new Date(val)),
			name: z.string(),
			profileId: z.string(),
		}),
	),
});

export const removeTagSchema = z.object({
	id: z.string(),
	tags: z.array(
		z.object({
			id: z.string(),
			createdAt: z.string().transform((val) => new Date(val)),
			updatedAt: z.string().transform((val) => new Date(val)),
			name: z.string(),
			profileId: z.string(),
		}),
	),
});
