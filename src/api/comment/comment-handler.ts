import type { Request, Response } from "express";

import type { GetCommentParams } from "./comment-schema.ts";
import type { CommentService } from "./comment-service.ts";

export const createCommentHandlers = (service: CommentService) => ({
	getCommentById: async (_req: Request<GetCommentParams>, res: Response) => {
		const { commentId } = res.locals.params;
		const comment = await service.getComment(commentId);
		return res.status(200).json(comment);
	},

	getAllComments: async (_req: Request, res: Response) => {
		const postId = res.locals.params.postId;
		const comments = await service.listComments(postId);
		return res.status(200).json(comments);
	},

	createComment: async (_req: Request, res: Response) => {
		const userId = res.locals.user.id;
		const postId = res.locals.params.postId;
		const comment = await service.createComment(
			res.locals.body,
			userId,
			postId,
		);
		return res.status(201).json(comment);
	},

	deleteComment: async (_req: Request<GetCommentParams>, res: Response) => {
		const { commentId } = res.locals.params;
		const userId = res.locals.user.id;
		await service.deleteComment(commentId, userId);
		return res.status(204).send();
	},

	updateComment: async (_req: Request<GetCommentParams>, res: Response) => {
		const { commentId } = res.locals.params;
		const userId = res.locals.user.id;
		const comment = await service.updateComment(
			commentId,
			res.locals.body,
			userId,
		);
		return res.status(200).json(comment);
	},
});
