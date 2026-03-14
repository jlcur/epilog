import { z } from "zod";

export const postSchema = z.object({
	id: z.number(),
	title: z.string(),
	content: z.string(),
});

export const getPostByIdSchema = z.object({
	params: z.object({
		postId: z
			.string()
			.min(1, "Post ID is required")
			.min(22, "Must be a valid short UUID format.")
			.max(22, "Must be a valid short UUID format."),
	}),
});

// Infer types from schemas
export type GetPostParams = z.infer<typeof getPostByIdSchema>["params"];
