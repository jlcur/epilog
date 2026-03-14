import AppError from "../../shared/errors/AppError.ts";
import type { PostEntity, PostRepository } from "./post-repository.ts";
import type { CreatePostInput } from "./post-schema.ts";

export interface PostService {
	getPost(id: string): Promise<PostEntity>;
	createPost(data: CreatePostInput, userId: string | null): Promise<PostEntity>;
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
});
