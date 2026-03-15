import AppError from "../../shared/errors/AppError.ts";
import type { PostEntity, PostRepository } from "./post-repository.ts";
import type { CreatePostInput } from "./post-schema.ts";

export interface PostService {
	getPost(id: string): Promise<PostEntity>;
	createPost(data: CreatePostInput, userId: string | null): Promise<PostEntity>;
	// TODO: fix return type
	listPosts(page: number, limit: number): any;
	deletePost(id: string, userId: string | null): Promise<void>;
}

export const createPostService = (repo: PostRepository) => ({
	async getPost(id: string) {
		const post = await repo.getPost(id);
		if (!post) throw new AppError(404, "Post not found");
		return post;
	},
	async createPost(data: CreatePostInput, userId: string | null) {
		const postData = { ...data, userId };
		return await repo.create(postData);
	},
	async listPosts(page: number, limit: number) {
		return await repo.list(page, limit);
	},
	async deletePost(id: string, userId: string | null) {
		const post = await repo.getPost(id);

		if (!post) throw new AppError(404, "Post not found");
		if (post.user_id !== userId) throw new AppError(403, "Forbidden");

		await repo.delete(id);
	},
});
