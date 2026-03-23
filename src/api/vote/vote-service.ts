import type { VoteRepository } from "./vote-repository.ts";

export interface VoteService {
	setPostVote(userId: string, postId: string, direction: 1 | -1): Promise<void>;
	setCommentVote(
		userId: string,
		commentId: string,
		direction: 1 | -1,
	): Promise<void>;
	removePostVote(userId: string, postId: string): Promise<void>;
	removeCommentVote(userId: string, commentId: string): Promise<void>;
	getPostScore(postId: string): Promise<number>;
	getCommentScore(commentId: string): Promise<number>;
}

export const createVoteService = (repo: VoteRepository): VoteService => ({
	async setPostVote(userId: string, postId: string, direction: 1 | -1) {
		// Check if an entry for this userId and postId already exists
		const voteExists = await repo.getPostVote(userId, postId);

		// If it exists and the vote direction is the same, remove the vote
		if (voteExists && direction === voteExists.value) {
			await repo.deletePostVote(userId, postId);
			return;
		}

		// Otherwise we set the direction
		await repo.togglePostVote(userId, postId, direction);
	},
	async setCommentVote(userId: string, commentId: string, direction: 1 | -1) {
		const voteExists = await repo.getCommentVote(userId, commentId);

		if (voteExists && direction === voteExists.value) {
			await repo.deleteCommentVote(userId, commentId);
			return;
		}

		await repo.toggleCommentVote(userId, commentId, direction);
	},
	async removePostVote(userId: string, postId: string) {
		await repo.deletePostVote(userId, postId);
	},
	async removeCommentVote(userId: string, commentId: string) {
		await repo.deleteCommentVote(userId, commentId);
	},
	async getPostScore(postId: string) {
		return await repo.getTotalPostVotes(postId);
	},
	async getCommentScore(commentId: string) {
		return await repo.getTotalCommentVotes(commentId);
	},
});
