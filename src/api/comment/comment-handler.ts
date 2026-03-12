import type { Request, Response } from "express";

import type { GetCommentParams } from "./comment-schema.ts";
import type { CommentService } from "./comment-service.ts";

export const createCommentHandlers = (service: CommentService) => ({
	getCommentById: async (req: Request<GetCommentParams>, res: Response) => {
		const { commentId } = req.params;
		const comment = await service.getComment(commentId);
		return res.status(200).json(comment);
	},

	getAllComments: async (_req: Request, res: Response) => {
		const comments = await service.listComments();
		return res.status(200).json(comments);
	},

	createComment: async (req: Request, res: Response) => {
		const userId = res.locals.user.id;
		const comment = await service.createComment(req.body, userId);
		return res.status(201).json(comment);
	},

	deleteComment: async (req: Request<GetCommentParams>, res: Response) => {
		const { commentId } = req.params;
		const userId = res.locals.user.id;
		await service.deleteComment(commentId, userId);
		return res.status(204).send();
	},

	updateComment: async (req: Request<GetCommentParams>, res: Response) => {
		const comment = await service.updateComment(req.params.commentId, req.body);
		return res.status(200).json(comment);
	},
});
