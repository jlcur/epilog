import { type Kysely, sql } from "kysely";
import short from "short-uuid";
import type { Database, NewVote } from "../../shared/database/types.ts";

// TODO: add batch query for getting multiple total scores for posts/comments at once
// TODO: add batch query for getting user votes on posts/comments

const translator = short.createTranslator();

export const createVoteRepository = (db: Kysely<Database>) => ({
	async togglePostVote(userId: string, postId: string, direction: 1 | -1) {
		const vote: NewVote = {
			user_id: userId,
			post_id: translator.toUUID(postId),
			value: direction,
			comment_id: null,
		};

		return await db
			.insertInto("votes")
			.values(vote)
			.onConflict((oc) =>
				oc.columns(["user_id", "post_id"]).doUpdateSet({ value: direction }),
			)
			.returningAll()
			.executeTakeFirst();
	},
	async toggleCommentVote(
		userId: string,
		commentId: string,
		direction: 1 | -1,
	) {
		const longId = translator.toUUID(commentId);

		const vote: NewVote = {
			user_id: userId,
			comment_id: longId,
			value: direction,
			post_id: null,
		};

		return await db
			.insertInto("votes")
			.values(vote)
			.onConflict((oc) =>
				oc.columns(["user_id", "comment_id"]).doUpdateSet({ value: direction }),
			)
			.returningAll()
			.executeTakeFirst();
	},
	async deletePostVote(userId: string, postId: string) {
		return await db
			.deleteFrom("votes")
			.where("user_id", "=", userId)
			.where("post_id", "=", translator.toUUID(postId))
			.executeTakeFirst();
	},
	async deleteCommentVote(userId: string, commentId: string) {
		return await db
			.deleteFrom("votes")
			.where("user_id", "=", userId)
			.where("comment_id", "=", translator.toUUID(commentId))
			.executeTakeFirst();
	},
	async getTotalPostVotes(postId: string) {
		const result = await db
			.selectFrom("votes")
			.select((eb) =>
				eb.fn.coalesce(eb.fn.sum("value"), sql<number>`0`).as("total_score"),
			)
			.where("post_id", "=", translator.toUUID(postId))
			.executeTakeFirst();

		return Number(result?.total_score ?? 0);
	},
	async getTotalCommentVotes(commentId: string) {
		const result = await db
			.selectFrom("votes")
			.select((eb) =>
				eb.fn.coalesce(eb.fn.sum("value"), sql<number>`0`).as("total_score"),
			)
			.where("comment_id", "=", translator.toUUID(commentId))
			.executeTakeFirst();

		return Number(result?.total_score ?? 0);
	},
	async getPostVote(userId: string, postId: string) {
		return await db
			.selectFrom("votes")
			.selectAll()
			.where("user_id", "=", userId)
			.where("post_id", "=", translator.toUUID(postId))
			.executeTakeFirst();
	},
	async getCommentVote(userId: string, commentId: string) {
		return await db
			.selectFrom("votes")
			.selectAll()
			.where("user_id", "=", userId)
			.where("comment_id", "=", translator.toUUID(commentId))
			.executeTakeFirst();
	},
});

export type VoteRepository = ReturnType<typeof createVoteRepository>;
