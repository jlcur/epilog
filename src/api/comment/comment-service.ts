import AppError from "../../shared/errors/AppError.ts";
import type { CommentEntity, CommentRepository } from "./comment-repository.ts";
import type {
	CreateCommentInput,
	UpdateCommentInput,
} from "./comment-schema.ts";

export interface CommentService {
	getComment(id: string): Promise<CommentEntity>;
	listComments(): Promise<CommentEntity[]>;
	createComment(data: CreateCommentInput): Promise<CommentEntity>;
	deleteComment(id: string): Promise<void>;
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
	async createComment(data: CreateCommentInput) {
		return await repo.create(data);
	},
	async deleteComment(id: string) {
		const deleted = await repo.delete(id);
		if (!deleted) throw new AppError(404, "Comment not found");
	},
	async updateComment(id: string, data: UpdateCommentInput) {
		const updatedComment = await repo.update(id, data);
		if (!updatedComment) throw new AppError(404, "Comment not found");
		return updatedComment;
	},
});
