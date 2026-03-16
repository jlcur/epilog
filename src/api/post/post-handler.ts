import type { Request, Response } from "express";
import type { GetPostParams } from "./post-schema.ts";
import type { PostService } from "./post-service.ts";

const POSTS_LIMIT = 20;

export const createPostHandlers = (service: PostService) => ({
	getPostById: async (_req: Request<GetPostParams>, res: Response) => {
		const { postId } = res.locals.params;
		const post = await service.getPost(postId);
		return res.status(200).json(post);
	},
	createPost: async (_req: Request, res: Response) => {
		const userId = res.locals.user.id;
		const post = await service.createPost(res.locals.body, userId);
		return res.status(201).json(post);
	},
	getAllPosts: async (_req: Request, res: Response) => {
		const page: number = Number(res.locals.query.page) || 1;
		const limit: number = Number(res.locals.query.limit) || POSTS_LIMIT;

		const result = await service.listPosts(page, limit);

		return res.status(200).json({
			data: result.results,
			total: result.total,
			currentPage: result.page,
			totalPages: result.totalPages,
		});
	},
	deletePostById: async (_req: Request, res: Response) => {
		const { postId } = res.locals.params;
		const userId = res.locals.user.id;
		await service.deletePost(postId, userId);
		return res.status(204).send();
	},
	updatePost: async (_req: Request<GetPostParams>, res: Response) => {
		const { postId } = res.locals.params;
		const userId = res.locals.user.id;
		const post = await service.updatePost(postId, res.locals.body, userId);
		return res.status(200).json(post);
	},
});
