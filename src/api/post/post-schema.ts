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

export const createPostSchema = z.object({
	body: z.object({
		title: z.string().min(1, "Post title is required"),
		content: z.string().min(1, "Post content is required"),
	}),
});

export const getAllPostsPaginatedSchema = z.object({
	query: z.object({
		page: z.string().optional(),
		limit: z.string().optional(),
	}),
});

// Infer types from schemas
export type GetPostParams = z.infer<typeof getPostByIdSchema>["params"];
export type CreatePostInput = z.infer<typeof createPostSchema>["body"];
export type GetPostsSchema = z.infer<
	typeof getAllPostsPaginatedSchema
>["query"];
