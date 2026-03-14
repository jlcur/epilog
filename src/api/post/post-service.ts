import AppError from "../../shared/errors/AppError.ts";
import type { PostEntity, PostRepository } from "./post-repository.ts";

export interface PostService {
	getPost(id: string): Promise<PostEntity>;
}

export const createPostService = (repo: PostRepository) => ({
	async getPost(id: string) {
		const post = await repo.getPost(id);
		if (!post) throw new AppError(404, "Post not found");
		return post;
	},
});
