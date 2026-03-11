import { z } from "zod";

export const commentSchema = z.object({
	id: z.number(),
	content: z.string(),
});

export const getCommentByIdSchema = z.object({
	params: z.object({
		commentId: z
			.string()
			.min(1, "Comment ID is required")
			.min(22, "Must be valid short UUID format.")
			.max(22, "Must be valid short UUID format."),
	}),
});

export const createCommentSchema = z.object({
	body: z.object({
		content: z
			.string()
			.min(1, "Comment content must be at least one character"),
		parent_id: z.string().nullable().optional(),
	}),
});

export const updateCommentSchema = z.object({
	body: z.object({
		content: z.string().min(1).optional(),
	}),
	params: z.object({
		commentId: z
			.string()
			.min(1, "Comment ID is required")
			.min(22, "Must be valid short UUID format.")
			.max(22, "Must be valid short UUID format."),
	}),
});

// Infer types from schemas
export type GetCommentParams = z.infer<typeof getCommentByIdSchema>["params"];
export type CreateCommentInput = z.infer<typeof createCommentSchema>["body"];
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>["body"];
