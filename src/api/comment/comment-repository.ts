import { type Kysely, sql } from "kysely";
import short from "short-uuid";
import type { Database } from "../../shared/database/types.ts";
import type {
	CreateCommentInput,
	UpdateCommentInput,
} from "./comment-schema.ts";

export interface CommentEntity {
	id: string;
	content: string;
	created_at: Date;
	user_id: string | null;
}

const translator = short.createTranslator();

export const createCommentRepository = (db: Kysely<Database>) => ({
	/**
	 * Finds a comment by ID
	 * @param id A shortened UUID
	 * @returns The comment
	 */
	async getComment(id: string) {
		const longId = translator.toUUID(id);

		const result = await db
			.selectFrom("comments")
			.leftJoin("user", "comments.user_id", "user.id")
			.where("comments.id", "=", longId)
			.selectAll("comments")
			.select("user.name as user_name")
			.executeTakeFirst();

		return result
			? {
					...result,
					id: translator.fromUUID(result.id),
					parent_id: result.parent_id
						? translator.fromUUID(result.parent_id)
						: null,
					post_id: result.post_id ? translator.fromUUID(result.post_id) : null,
				}
			: undefined;
	},
	/**
	 * Returns all comments
	 * @returns All comments
	 */
	async list(postId?: string) {
		let query = db
			.selectFrom("comments")
			.leftJoin("user", "comments.user_id", "user.id")
			.selectAll("comments")
			.select("user.name as user_name");

		if (postId) {
			query = query.where("comments.post_id", "=", translator.toUUID(postId));
		}

		const result = await query.execute();

		return result.map((row) => ({
			...row,
			id: translator.fromUUID(row.id),
			parent_id: row.parent_id ? translator.fromUUID(row.parent_id) : null,
			post_id: row.post_id ? translator.fromUUID(row.post_id) : null,
		}));
	},
	async getCommentWithVotes(id: string, userId: string | null) {
		const longId = translator.toUUID(id);

		const result = await db
			.selectFrom("comments")
			.leftJoin("user", "comments.user_id", "user.id")
			.where("comments.id", "=", longId)
			.selectAll("comments")
			.select("user.name as user_name")
			.select((eb) => [
				eb
					.selectFrom("votes")
					.select(sql<number>`coalesce(sum(value), 0)`.as("v"))
					.whereRef("votes.comment_id", "=", "comments.id")
					.as("vote_score"),
				userId
					? eb
							.selectFrom("votes")
							.select("votes.value")
							.whereRef("votes.comment_id", "=", "comments.id")
							.where("votes.user_id", "=", userId)
							.as("user_vote")
					: sql<1 | -1 | null>`null`.as("user_vote"),
			])
			.executeTakeFirst();

		return result
			? {
					...result,
					id: translator.fromUUID(result.id),
					parent_id: result.parent_id
						? translator.fromUUID(result.parent_id)
						: null,
					post_id: result.post_id ? translator.fromUUID(result.post_id) : null,
					vote_score: Number(result.vote_score),
				}
			: undefined;
	},
	async listWithVotes(userId: string | null, postId?: string) {
		let query = db
			.selectFrom("comments")
			.leftJoin("user", "comments.user_id", "user.id")
			.selectAll("comments")
			.select("user.name as user_name")
			.select((eb) => [
				eb
					.selectFrom("votes")
					.select(sql<number>`coalesce(sum(value), 0)`.as("v"))
					.whereRef("votes.comment_id", "=", "comments.id")
					.as("vote_score"),
				userId
					? eb
							.selectFrom("votes")
							.select("votes.value")
							.whereRef("votes.comment_id", "=", "comments.id")
							.where("votes.user_id", "=", userId)
							.as("user_vote")
					: sql<1 | -1 | null>`null`.as("user_vote"),
			]);

		if (postId) {
			query = query.where("comments.post_id", "=", translator.toUUID(postId));
		}

		const result = await query.execute();

		return result.map((row) => ({
			...row,
			id: translator.fromUUID(row.id),
			parent_id: row.parent_id ? translator.fromUUID(row.parent_id) : null,
			post_id: row.post_id ? translator.fromUUID(row.post_id) : null,
			vote_score: Number(row.vote_score),
		}));
	},
	/**
	 * Creates a new comment
	 * @param data The comment data to create
	 * @returns The created comment
	 */
	async create(
		data: CreateCommentInput & { userId: string | null; postId: string },
	) {
		const longId = data.parent_id ? translator.toUUID(data.parent_id) : null;
		const longPostId = translator.toUUID(data.postId);

		const result = await db
			.insertInto("comments")
			.values({
				content: data.content,
				parent_id: longId,
				user_id: data.userId,
				post_id: longPostId,
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return { ...result, id: translator.fromUUID(result.id) };
	},
	/**
	 * Deletes a comment by ID
	 * @param id The comment ID
	 * @returns True if comment was found and deleted, false if comment was not found
	 */
	async delete(id: string) {
		const longId = translator.toUUID(id);

		const result = await db
			.updateTable("comments")
			.set({
				is_deleted: true,
				content: "[ This comment has been deleted ]",
			})
			.where("id", "=", longId)
			.executeTakeFirst();

		return Number(result.numUpdatedRows) > 0;
	},
	/**
	 * Updates a comment by ID
	 * @param id The comment ID
	 * @param data Partial comment data to update with
	 * @returns Updated comment or null if not found
	 */
	async update(id: string, data: UpdateCommentInput) {
		if (!data.content) return null;

		const longId = translator.toUUID(id);

		const result =
			(await db
				.updateTable("comments")
				.set({ content: data.content })
				.where("id", "=", longId)
				.returningAll()
				.executeTakeFirst()) ?? null;

		return result ? { ...result, id: translator.fromUUID(result.id) } : null;
	},
});

export type CommentRepository = ReturnType<typeof createCommentRepository>;
