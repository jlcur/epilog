import AppError from "../../shared/errors/AppError.ts";
import type { CommentEntity, CommentRepository } from "./comment-repository.ts";
import type {
	CreateCommentInput,
	UpdateCommentInput,
} from "./comment-schema.ts";

export interface CommentService {
	getComment(id: string): Promise<CommentEntity>;
	listComments(): Promise<CommentEntity[]>;
	createComment(
		data: CreateCommentInput,
		userId: string | null,
	): Promise<CommentEntity>;
	deleteComment(id: string, userId: string | null): Promise<void>;
	updateComment(id: string, data: UpdateCommentInput): Promise<CommentEntity>;
}

export const createCommentService = (
	repo: CommentRepository,
): CommentService => ({
	async getComment(id: string) {
		const comment = await repo.getComment(id);
		if (!comment) throw new AppError(404, "Comment not found");
		return comment;
	},
	async listComments() {
		return await repo.list();
	},
	async createComment(data: CreateCommentInput, userId: string | null) {
		const commentData = { ...data, userId };
		return await repo.create(commentData);
	},
	async deleteComment(id: string, userId: string | null) {
		const comment = await repo.getComment(id);

		if (!comment) throw new AppError(404, "Comment not found");
		if (comment.user_id !== userId) throw new AppError(403, "Forbidden");

		await repo.delete(id);
	},
	async updateComment(id: string, data: UpdateCommentInput) {
		const updatedComment = await repo.update(id, data);
		if (!updatedComment) throw new AppError(404, "Comment not found");
		return updatedComment;
	},
});
