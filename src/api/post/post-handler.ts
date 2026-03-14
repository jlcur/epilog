import type { Request, Response } from "express";
import type { GetPostParams } from "./post-schema.ts";
import type { PostService } from "./post-service.ts";

export const createPostHandlers = (service: PostService) => ({
	getPostById: async (req: Request<GetPostParams>, res: Response) => {
		const { postId } = req.params;
		const post = await service.getPost(postId);
		return res.status(200).json(post);
	},
	createPost: async (req: Request, res: Response) => {
		const userId = res.locals.user.id;
		const post = await service.createPost(req.body, userId);
		return res.status(201).json(post);
	},
});
