import { z } from "zod";

export const votePostSchema = z.object({
	params: z.object({
		postId: z
			.string()
			.min(1, "Post ID is required")
			.min(22, "Must be a valid short UUID format.")
			.max(22, "Must be a valid short UUID format."),
	}),
	body: z.object({
		direction: z.union([z.literal(1), z.literal(-1)]),
	}),
});

export const voteCommentSchema = z.object({
	params: z.object({
		commentId: z
			.string()
			.min(1, "Comment ID is required")
			.min(22, "Must be a valid short UUID format.")
			.max(22, "Must be a valid short UUID format."),
	}),
	body: z.object({
		direction: z.union([z.literal(1), z.literal(-1)]),
	}),
});
