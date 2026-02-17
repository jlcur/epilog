import { z } from "zod";

export const commentSchema = z.object({
	id: z.number(),
	content: z.string(),
});

export const getCommentByIdSchema = z.object({
	params: z.object({
		commentId: z.uuid().min(1, "Comment ID is required"),
	}),
});

export const createCommentSchema = z.object({
	body: z.object({
		content: z
			.string()
			.min(1, "Comment content must be at least one character"),
	}),
});

export const updateCommentSchema = z.object({
	body: z.object({
		content: z.string().min(1).optional(),
	}),
	params: z.object({
		commentId: z.uuid().min(1),
	}),
});

// Infer types from schemas
export type GetCommentParams = z.infer<typeof getCommentByIdSchema>["params"];
export type CreateCommentInput = z.infer<typeof createCommentSchema>["body"];
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>["body"];
